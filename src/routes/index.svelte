<script context="module">
	import { zip } from 'lodash';
	import { segmentProperties } from '../types';
	import {
		getSegmentState,
		aggregateTrafficSnapshotData,
		sortMetric,
		chainFetches
	} from '../utils';
	export async function load({ fetch }) {
		const res = await fetch('/api/current_traffic');
		if (res.ok) {
			const resp = await res.json();
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
	import { info } from 'spaper/components/Toast';
	import Map from '$lib/components/Map.svelte';
	import { MetricEnum } from '../types';
	export let metric = MetricEnum.NONE;
	let metricsAvailable = false;
	let switch1 = false;
	let switch2 = false;
	let switch3 = false;
	const updateMetric = (m, v) => {
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
			case MetricEnum.RATIO_SPEEDING_VIOLATION: {
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
			case MetricEnum.SPEEDING_VIOLATION_SPEED: {
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
	$: switch2 && updateMetric(MetricEnum.RATIO_SPEEDING_VIOLATION, true);
	$: !switch2 && updateMetric(MetricEnum.RATIO_SPEEDING_VIOLATION, false);
	$: switch3 && updateMetric(MetricEnum.SPEEDING_VIOLATION_SPEED, true);
	$: !switch3 && updateMetric(MetricEnum.SPEEDING_VIOLATION_SPEED, false);
	export let snapshot = [];
	let timeStartCall;
	const timeEnd = new Date();
	let timeStart = new Date(timeEnd);
	timeStart.setDate(timeStart.getDate() - 7);
	onMount(async () => {
		timeStartCall = new Date();
		if (snapshot.some((seg) => seg.properties.name === '-')) {
			console.log(
				`Unknown name for segments: ${snapshot
					.filter((seg) => seg.properties.name === '-')
					.map((seg) => seg.properties.segment_id)}`
			);
		}
		console.log('Fetching historic data');
		await delay(1000);
		const speedResponses = await chainFetches(
			snapshot.map(
				(segment) =>
					`/api/speed-${
						segment.properties.segment_id
					}-${timeStart.toUTCString()}-${timeEnd.toUTCString()}`
			),
			1000,
			1
		);
		const success = speedResponses.every((resp) => resp.status_code === 200);
		console.log(`Historic data fetched, success = ${success}`);
		if (success) {
			const timeEndCall = new Date();
			console.log(`Calls took ${timeEndCall.getTime() - timeStartCall.getTime()} ms`);
			const updateProperties = speedResponses.map((speed) =>
				aggregateTrafficSnapshotData(speed.report)
			);
			console.log(
				`Unknown segments: `,
				updateProperties.filter((p) => p.name === '').map((p) => p.segment_id)
			);
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
		} else {
			const failedSegmentIds = zip(snapshot, speedResponses)
				.filter(([info, speed]) => speed.status_code !== 200)
				.map(([info, speed]) => info?.properties?.segment_id);
			console.log(
				`Failed to fetch historic data for ${failedSegmentIds.length} / ${
					snapshot.length
				} segments: ${failedSegmentIds.join(', ')}`
			);
		}
	});
	// $: segments = snapshot.features.map(x => x.properties.segment_id)
</script>

<!-- {segments} -->
<Map {snapshot} {metric} />
<div id="metric-group" class="border paper form-group flex-spaces" hidden={!metricsAvailable}>
	<Switch bind:checked={switch1}>{MetricEnum.VULNERABLE_ROAD_USER_TO_CAR.name}</Switch><br />
	<Switch bind:checked={switch2}>{MetricEnum.RATIO_SPEEDING_VIOLATION.name}</Switch><br />
	<Switch bind:checked={switch3}>{MetricEnum.SPEEDING_VIOLATION_SPEED.name}</Switch><br />
</div>
