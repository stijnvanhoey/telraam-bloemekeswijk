<script>
	import { Card, Button } from 'spaper';

	export let post;

	let currentDateString = post.date;

	let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	$: currentDate = new Date(Date.parse(currentDateString)).toLocaleString('nl-BE', options);
</script>

{#if post}
	<div class="postcard">
		<Card title={post.title} image="/img/{post.banner}" subTitle="{currentDate} door {post.author}">
			{post.excerpt}
			<p slot="bottom">
				<Button isLink="true" href={post.slug}>Lees verder...</Button>
			</p>
		</Card>
	</div>
{/if}
