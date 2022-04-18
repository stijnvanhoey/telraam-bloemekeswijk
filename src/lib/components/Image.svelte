<script>
	export let alt;
	export let filename;
	export let width = '400px';
	export let floatClass;

	let imageSrc;
	$: imageSrc = `/img/${filename}`;
</script>

<img src={imageSrc} {alt} loading="lazy" decoding="async" class={floatClass} {width} />
