import rateLimit from '../_utils/_lru_cache';

const limiter = rateLimit({
	interval: 60 * 1000, // 60 seconds
	uniqueTokenPerInterval: 10 // Max 10 users per second
});

export async function get(request) {
	const limit = parseInt(import.meta.env.VITE_API_LIMIT, 20); // number of requests per minute
	const currentUsage = await limiter.check(request, limit, 'CACHE_TOKEN');
	const isRateLimited = currentUsage >= parseInt(limit, 10);

	if (isRateLimited) {
		console.log('Rate limit exceeded...');
		return {
			status: 429,
			error: new Error(`Rate limit exceeded.`)
		};
	} else {
		console.log(`${request.params.segmentid}`);
		console.log('Requesting speed data from API telraam...');
		const token = import.meta.env.VITE_TELRAAM_API_KEY;
		const url = 'https://telraam-api.net/v1/reports/traffic';
		// Note -> did not work with json.stringify, so defined as raw body
		let raw = `{\r\n \"level\":\"segments\",\r\n \"format\":\"per-hour\",\r\n \"id\":\"${request.params.segmentid}\",\r\n \"time_start\":\"2021-12-01 12:00:00Z\",\r\n \"time_end\":\"2021-12-02 12:00:00Z\"}\r\n`;

		const res = await fetch(url, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				'X-Api-Key': token
			},
			body: raw,
			redirect: 'follow'
		});
		if (res.ok) {
			console.log('Speed data request from Telraam succesfull.');
			return {
				statusCode: 200,
				headers: {
					'content-type': 'application/json',
					'X-RateLimit-Limit': limit,
					'X-RateLimit-Remaining': isRateLimited ? 0 : limit - currentUsage
				},
				body: await res.json()
			};
		} else {
			return {
				status: res.status,
				error: new Error(`Could not load ${url}`)
			};
		}
	}
}
