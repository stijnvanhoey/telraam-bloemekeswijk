<script context="module">
	import { segmentProperties } from '../types';
	import { getSegmentState, aggregateTrafficSnapshotData } from '../utils';
	export async function load({ fetch }) {
		const res = await fetch('/api/current_traffic');
		if (res.ok) {			
			const resp = await res.json();
			console.log(resp);
			/** @type {Array.<SegmentGeoJSONData>} snapshot */
			const snapshot = resp.features.map(el => ({
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
	import Map from '$lib/components/Map.svelte';
	export let snapshot = [];
	const timeEnd = new Date();
	let timeStart = new Date(timeEnd);
	timeStart.setMonth(timeStart.getMonth() - 1);
	onMount(() => {
		const updateProperties = Promise.all(
	        snapshot.map(segment => {
	            return fetch(`/api/speed-${segment.properties.segment_id}-${timeStart.toUTCString()}-${timeEnd.toUTCString()}`);
	        })
	    ).then(responses => {
	        return Promise.all(responses.map(res => {
	            return res.json()
	        }));
	    }).then(speeds => {
			const updateProperties = speeds.map(speed => aggregateTrafficSnapshotData(speed.report));
			const updatedSnapshot = JSON.parse(JSON.stringify(snapshot));
			updateProperties.forEach((prop, idx) => {
				if (prop.name !== '') {
					updatedSnapshot[idx].properties = prop;
				}
			});
			return {
				props: {
					snapshot: updatedSnapshot
				}
			};
	    }).catch(error => {
	        console.log(error);
	    });
	});
	// $: segments = snapshot.features.map(x => x.properties.segment_id)
</script>

<!-- {segments} -->
<Map {snapshot} />
