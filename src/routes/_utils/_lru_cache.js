import LRUCache from 'lru-cache';

const rateLimit = (options) => {
	const tokenCache = new LRUCache({
		max: parseInt(options.uniqueTokenPerInterval || 500, 10),
		ttl: parseInt(options.interval || 60000, 10)
	});

	return {
		check: (event, limit, token) => {
			const tokenCount = tokenCache.get(token) || [0];
			if (tokenCount[0] === 0) {
				tokenCache.set(token, tokenCount);
			}
			tokenCount[0] += 1;

			const currentUsage = tokenCount[0];
			console.log(`Client ${event.clientAddress} remaining calls: ${limit - currentUsage}`);
			return currentUsage;
		}
	};
};

export default rateLimit;
