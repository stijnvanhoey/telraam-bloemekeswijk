<script context="module">
    export async function load({ fetch }) {
        const res = await fetch("/api/current_traffic")
        if (res.ok) {
            const data = await res.json()
            return  {
                props : {
                    data
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

import Map from '$lib/components/Map.svelte';
export let data=[];

</script>

<Map {data} />




