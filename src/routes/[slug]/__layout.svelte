<script context="module">
	export async function load({ url, fetch }) {
		const urn = `${url.pathname}.json`;
		const res = await fetch(urn);
		if (res.ok) {
			return {
				props: {
					post: await res.json()
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
	import { Article } from 'spaper';
	export let post;
	let currentDateString = post.date;

	let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	$: currentDate = new Date(Date.parse(currentDateString)).toLocaleString('nl-BE', options);
</script>

<Article title={post.title}>
	<p slot="meta">
		Geschreven door {post.author} op {currentDate}
	</p>
	<slot />
</Article>
