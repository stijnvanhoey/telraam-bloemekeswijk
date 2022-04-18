import vercel from '@sveltejs/adapter-vercel';
import { mdsvex } from 'mdsvex';
import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync(new URL('package.json', import.meta.url), 'utf8'));

/** @type {import('@sveltejs/kit').Config} */

const config = {
	preprocess: [
		mdsvex({
			extensions: ['.md']
		})
	],
	extensions: ['.svelte', '.md'],
	kit: {
		adapter: vercel(),
		vite: {}
	}
};

export default config;
