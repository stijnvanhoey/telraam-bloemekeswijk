<script context="module">
	// credits to https://github.com/matfantinel/matfantinel.github.io

	export async function load({ fetch }) {
		const url = '/blog.json';
		const res = await fetch(url);

		if (res.ok) {
			return {
				props: {
					posts: await res.json()
				}
			};
		}

		return {
			status: res.status,
			error: new Error(`Could not load ${url}`)
		};
	}
</script>

<script>
	import PostCard from '$lib/components/PostCard.svelte';

	export let posts;
</script>

<div class="row flex-spaces">
	{#each posts as post}
		<div class="sm-6 col"><PostCard {post} /></div>
	{/each}
</div>
