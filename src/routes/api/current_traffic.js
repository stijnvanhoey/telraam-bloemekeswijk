
export async function get() {
    const token = import.meta.env.VITE_TELRAAM_API_KEY
    const url = "https://telraam-api.net/v1/reports/traffic_snapshot";
    // Note -> did not work with json.stringify, so defined as raw body
    let raw = "{\r\n    \"time\":\"live\",\r\n    \"contents\":\"minimal\",\r\n    \"area\":\"3.705,51.0696,1\"\r\n}\r\n";

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-Api-Key': token
        },
        body: raw,
        redirect: 'follow'
    })

    if (res.ok) {
        return {
            body: await res.json()
        }
    }

    return {
        status: res.status,
        error: new Error(`Could not load ${url}`)
    }
}