import vercel from '@sveltejs/adapter-vercel';
import fs from "fs";

const pkg = JSON.parse(fs.readFileSync(new URL('package.json', import.meta.url), 'utf8'));

/** @type {import('@sveltejs/kit').Config} */

const config = {
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		adapter: vercel(),
		ssr: false,
		vite: {
			optimizeDeps: {
				include: ['lodash.omit', 'lodash.pick']
				}
		}
	}
};

export default config;
