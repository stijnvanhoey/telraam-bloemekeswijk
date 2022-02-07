<script context="module">
	import { SegmentStateEnum, segmentNames } from '../types';
	export async function load({ fetch }) {
		const res = await fetch('/api/current_traffic');
		if (res.ok) {

			const getSegmentState = (segmentData) => {
				if (segmentData.pedestrian === '' && segmentData.last_data_package) {
					return SegmentStateEnum.INACTIVE;
				} else if (segmentData.pedestrian === '') {
					return SegmentStateEnum.NEW;
				}
				return SegmentStateEnum.ACTIVE;
			} 
			
			const resp = await res.json();
			console.log(resp);
			/** @type {Array.<SegmentGeoJSONData>} snapshot */
			const snapshot = resp.features.map(el => ({
				type: el.type,
				geometry: el.geometry,
				properties: {
					segment_id: el.properties.segment_id,
					name: segmentNames[el.properties.segment_id],
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
	//let speedData = [];
	// onMount(
	//     Promise.all(
	//         snapshot.features.map(segment => {
	//             return fetch(`/api/speed-${segment.properties.segment_id}`)
	//         })
	//     ).then(function (responses) {
	//         return Promise.all(responses.map(res => {
	//             return res.json()
	//         }));
	//     }).then(speed => {
	//         console.log(speed.report);
	//         speedData = speed.report;
	//     }).catch(error => {
	//         console.log(error);
	//     })
	// );
	//$: segments = snapshot.features.map(x => x.properties.segment_id)
</script>

<!-- {segments} -->
<Map {snapshot} />
