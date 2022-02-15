<script context="module">
	import { segmentProperties } from '../types';
	import { getSegmentState, aggregateTrafficSnapshotData, sortMetric } from '../utils';
	export async function load({ fetch }) {
		const res = await fetch('/api/current_traffic');
		if (res.ok) {
			const resp = await res.json();
			console.log(resp);
			/** @type {Array.<SegmentGeoJSONData>} snapshot */
			let snapshot = resp.features.map((el) => ({
				type: el.type,
				geometry: el.geometry,
				properties: {
					segment_id: el.properties.segment_id,
					name: segmentProperties[el.properties.segment_id]?.name || '-',
					speed_limit: segmentProperties[el.properties.segment_id]?.speed_limit || null,
					date: el.properties.date,
					pedestrian: el.properties.pedestrian,
					bike: el.properties.bike,
					car: el.properties.car,
					heavy: el.properties.heavy,
					state: getSegmentState(el.properties),
					last_data_package: el.properties.last_data_package
				}
			}));
			console.log(snapshot);
			return {
				props: {
					snapshot
				}
			};
		} else {
			if (res.status === 429) {
				return {
					status: 429,
					error: 'Exceeded API requests for Telraam data, please try reloading the page later.'
				};
			} else {
				return {
					status: res.status,
					error: new Error(`Could not load Telraam traffic data.`)
				};
			}
		}
	}
</script>

<script>
	import { onMount } from 'svelte';
	import { Switch } from 'spaper';
	import Map from '$lib/components/Map.svelte';
	import { MetricEnum } from '../types';
	export let metric = MetricEnum.NONE;
	let metricsAvailable = false;
	let switch1 = false;
	let switch2 = false;
	let switch3 = false;
	const updateMetric = (m, v) => {
		// TODO can this easily be generalized?
		console.log('here');
		switch (m) {
			case MetricEnum.VULNERABLE_ROAD_USER_TO_CAR: {
				if (switch1 === false) {
					if (switch2 || switch3) {
						// This is only triggered by enabling another metric.
						// Ignore in this case.
						return;
					}
					metric = MetricEnum.NONE;
				} else {
					metric = m;
					switch2 = false;
					switch3 = false;
				}
				break;
			}
			case MetricEnum.TOO_FAST_120_PERCENT: {
				if (switch2 === false) {
					if (switch1 || switch3) {
						// This is only triggered by enabling another metric.
						// Ignore in this case.
						return;
					}
					metric = MetricEnum.NONE;
				} else {
					metric = m;
					switch1 = false;
					switch3 = false;
				}
				break;
			}
			case MetricEnum.TOO_FAST_120_PERCENT_PLUS: {
				if (switch3 === false) {
					if (switch1 || switch2) {
						// This is only triggered by enabling another metric.
						// Ignore in this case.
						return;
					}
					metric = MetricEnum.NONE;
				} else {
					metric = m;
					switch1 = false;
					switch2 = false;
				}
				break;
			}
		}
	};
	$: switch1 && updateMetric(MetricEnum.VULNERABLE_ROAD_USER_TO_CAR, true);
	$: !switch1 && updateMetric(MetricEnum.VULNERABLE_ROAD_USER_TO_CAR, false);
	$: switch2 && updateMetric(MetricEnum.TOO_FAST_120_PERCENT, true);
	$: !switch2 && updateMetric(MetricEnum.TOO_FAST_120_PERCENT, false);
	$: switch3 && updateMetric(MetricEnum.TOO_FAST_120_PERCENT_PLUS, true);
	$: !switch3 && updateMetric(MetricEnum.TOO_FAST_120_PERCENT_PLUS, false);
	export let snapshot = [];
	const timeEnd = new Date();
	let timeStart = new Date(timeEnd);
	timeStart.setMonth(timeStart.getMonth() - 1);
	onMount(() => {
		const updateProperties = Promise.all(
			snapshot.map((segment) => {
				return fetch(
					`/api/speed-${
						segment.properties.segment_id
					}-${timeStart.toUTCString()}-${timeEnd.toUTCString()}`
				);
			})
		)
			.then((responses) => {
				return Promise.all(
					responses.map((res) => {
						return res.json();
					})
				);
			})
			.then((speeds) => {
				const updateProperties = speeds.map((speed) => aggregateTrafficSnapshotData(speed.report));
				const updatedSnapshot = JSON.parse(JSON.stringify(snapshot));
				updateProperties.forEach((prop, idx) => {
					if (prop.name !== '') {
						updatedSnapshot[idx].properties = prop;
					}
				});
				Object.values(MetricEnum)
					.filter((m) => m.name !== MetricEnum.NONE.name)
					.forEach((m) => {
						const updatedMetrics = sortMetric(
							updatedSnapshot.map((s) => s.properties.metrics?.[m.name]),
							m.decreasing
						);
						updatedMetrics.forEach((um, i) => {
							if (um) {
								updatedSnapshot[i].properties.metrics[m.name] = um;
							}
						});
					});
				metricsAvailable = true;
				snapshot = updatedSnapshot;
			})
			.catch((error) => {
				console.log(error);
			});
	});
	// $: segments = snapshot.features.map(x => x.properties.segment_id)
</script>

<!-- {segments} -->
<Map {snapshot} {metric} />
<div id="metric-group" class="border paper form-group flex-spaces" hidden={!metricsAvailable}>
	<Switch bind:checked={switch1}>{MetricEnum.VULNERABLE_ROAD_USER_TO_CAR.name}</Switch><br />
	<Switch bind:checked={switch2}>{MetricEnum.TOO_FAST_120_PERCENT.name}</Switch><br />
	<Switch bind:checked={switch3}>{MetricEnum.TOO_FAST_120_PERCENT_PLUS.name}</Switch><br />
</div>
