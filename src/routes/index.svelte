<script context="module">
    export async function load({ fetch }) {
        const res = await fetch("/api/current_traffic")
        const data = await res.json()
        return  {
            props : {
                data
            }
        }
    }
</script>

<script>

import Map from '$lib/components/Map.svelte';
export let data=[];

</script>

<Map {data} />




