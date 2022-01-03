<script context="module">
    export async function load({ fetch }) {
        const res = await fetch("/api/current_traffic")
        if (res.ok) {
            const snapshot = await res.json()
            console.log(snapshot)
            return  {
                props : {
                    snapshot
                }
            }
        }
        else {
            if (res.status === 429) {
                return {
                    status: 429,
                    error: "Exceeded API requests for Telraam data, please try reloading the page later."
                };
            }
            else {
                return {
                    status: res.status,
                    error: new Error(`Could not load Telraam traffic data.`)
                }
            }

        }
    }
</script>

<script>
import { onMount } from 'svelte';
import Map from '$lib/components/Map.svelte';

export let snapshot = [];
let speedData = [];

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

$: segments = snapshot.features.map(x => x.properties.segment_id)

</script>

<!-- {segments} -->
<Map {snapshot} />




