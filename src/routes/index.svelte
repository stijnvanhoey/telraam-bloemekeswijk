<script context="module">

    const token = "XXXXXXXXXXX";  // TODO - HIDE CREDENTIAL!
    const url = "https://telraam-api.net/v1/reports/traffic_snapshot";
    // Note -> did not work with json.stringify, so defined as raw body
    let raw = "{\r\n    \"time\":\"live\",\r\n    \"contents\":\"minimal\",\r\n    \"area\":\"3.705,51.0696,1\"\r\n}\r\n";

    // !! CORS header is not working - TODO; make workaround
    export async function load({ fetch }) {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'X-Api-Key': token
        },
        body: raw, //JSON.stringify(body_raw),
        redirect: 'follow'
      })

      //console.log(res.status)

      if (res.ok) {
        return {
          props: {
            data: await res.json()
          }
        }
      }

      return {
        status: res.status,
        error: new Error(`Could not load ${url}`)
       }
    }
  </script>

<script>

import Map from '$lib/components/Map.svelte';

export let data=[];

</script>

<Map {data} />




