<script>
	export let message;
</script>

<div id="tooltip" role="tooltip">
	{message}
	<div id="arrow" data-popper-arrow />
</div>

<style>
	#tooltip {
		background: goldenrod;
		color: white;
		font-weight: bold;
		padding: 4px 8px;
		font-size: 13px;
		border-radius: 4px;
	}

	#arrow,
	#arrow::before {
		position: absolute;
		width: 8px;
		height: 8px;
		z-index: -1;
	}

	#arrow::before {
		content: '';
		transform: rotate(45deg);
		background: goldenrod;
	}

	:global(#tooltip[data-popper-placement^='top'] > #arrow) {
		bottom: -4px;
	}

	:global(#tooltip[data-popper-placement^='bottom'] > #arrow) {
		top: -4px;
	}

	:global(#tooltip[data-popper-placement^='left'] > #arrow) {
		right: -4px;
	}

	:global(#tooltip[data-popper-placement^='right'] > #arrow) {
		left: -4px;
	}
</style>
