<script>
	export let alt;
	export let filename;
    export let floatClass;

    let imageSrc;
    $: imageSrc = `/img/${filename}`;
</script>

<img src="{imageSrc}" {alt} loading="lazy" decoding="async" class={floatClass} />