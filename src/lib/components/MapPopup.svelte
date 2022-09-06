<script>
	import { Badge } from 'spaper';
	import { MetricEnum, SegmentStateEnum, ErrorSegmentState } from '../../types';
	import { colorFeatureMetric, defaultColorMap } from '../../utils';

	export let properties;
	const defaultColors = defaultColorMap();
	let previousDateString = properties.dateStart ?? properties.date;
	let currentDateString = properties.dateEnd ?? properties.date;
	console.log(previousDateString, currentDateString)
	if (previousDateString === currentDateString) {
		try {
			const currentTime = new Date(Date.parse(currentDateString)).getTime();
			let previousDate_ = new Date()
			previousDate_.setTime(currentTime - 1000 * 60 * 60)
			previousDateString = previousDate_.toISOString()
		} catch {
			// In case of inactive sensors
		}
	}

	let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	console.log(previousDateString, currentDateString)
	const currentDateStr = new Date(Date.parse(currentDateString)).toLocaleString('nl-BE', options);
	const currentHourNum = new Date(Date.parse(currentDateString)).getHours();
	const previousDateStr = new Date(Date.parse(previousDateString)).toLocaleString('nl-BE', options);
	const previousHourNum = new Date(Date.parse(previousDateString)).getHours();
	const isMetric = properties.metric.name !== MetricEnum.NONE.name;
	const showSpeedLimit = properties.metric.showSpeedLimit;
	const isNotWorking = isMetric && isNaN(properties.metrics?.[properties.metric.name]?.value);
	let backgroundColor;
	if (isMetric) {
		backgroundColor = colorFeatureMetric({ properties }, properties.metric);
	} else {
		backgroundColor = (defaultColors[properties?.state] || defaultColors[ErrorSegmentState]).color;
	}
	const style = `background-color=${backgroundColor}`;
	const isInactive =
		properties.state === SegmentStateEnum.INACTIVE ||
		(isMetric &&
			!isNaN(properties.metrics?.[properties.metric.name]?.rank) &&
			properties.metrics[properties.metric.name].rank > 2);
	const isNew =
		properties.state === SegmentStateEnum.NEW ||
		(isMetric &&
			!isNaN(properties.metrics?.[properties.metric.name]?.rank) &&
			properties.metrics[properties.metric.name].rank === 2);
	const isFirst =
		isMetric &&
		!isNaN(properties.metrics?.[properties.metric.name]?.rank) &&
		properties.metrics[properties.metric.name].rank === 1;

	const isDefault = !isInactive && !isNew;
	$: currentDate = currentDateStr === 'Invalid Date' ? '-' : currentDateStr;
	$: previousDate = previousDateStr === 'Invalid Date' ? '-' : previousDateStr;
	$: previousHour = isNaN(previousHourNum) ? '-' : previousHourNum;
	$: currentHour = isNaN(currentHourNum) ? '-' : currentHourNum;
</script>

<div
	class="border padding-left-small padding-right-small shadow shadow-small"
	style="background-color: {backgroundColor}"
>
	<h4>{properties.name}</h4>
	<h5 class="child-borders">
		{#if !isMetric}
			{properties.state}<br />
		{/if}
		{#if isMetric && showSpeedLimit}
			Snelheidslimiet: {properties.speed_limit} km/u<br />
		{/if}
		{#if isDefault && !isFirst && !isNotWorking}
			Snelheidslimiet: {properties.speed_limit} km/u<br />
			Hier zijn tussen {previousDate}
			{previousHour} uur<br /> en {currentDate}
			{currentHour} uur<br />
			<Badge type="primary">
				{Math.round(properties.pedestrian)}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					aria-hidden="true"
					role="img"
					class="iconify iconify--gis"
					width="32"
					height="32"
					preserveAspectRatio="xMidYMid meet"
					viewBox="0 0 100 100"
					><path
						d="M55.017 7.5c-3.844 0-6.892 3.18-6.892 7.024s3.048 7.025 6.892 7.025c3.976 0 7.024-3.181 7.024-7.025c0-3.843-3.048-7.024-7.024-7.024zm-5.964 13.518c-1.458.133-2.651.928-3.579 1.59c-1.193.929-3.048 2.917-3.048 2.917v.132c-.133 0-7.422 8.482-11.663 12.458c-.398.398-.663.795-.795 1.326l-2.12 11.53c-.398 1.325.662 2.916 1.987 3.18c1.326.266 2.916-.794 3.048-2.252l2.121-10.736l8.217-8.217v21.868l-4.639 11.53L24.27 86.623a3.994 3.994 0 0 0-.663 2.784c.133.927.663 1.855 1.458 2.385c.795.663 1.855.795 2.916.663c.927-.265 1.855-.795 2.385-1.59v-.133l14.446-20.41l.398-.795l5.434-13.519l10.735 14.446l7.952 18.555c.663 1.723 3.048 2.65 4.771 1.855c1.723-.662 2.651-3.048 1.988-4.77l-8.084-18.82l-.398-.796L57.27 52.694V35.862l4.108 4.771l.398.398l10.602 8.217c.928.795 2.784.663 3.579-.398c.795-1.06.53-2.783-.398-3.71l-10.337-8.085c-3.181-3.711-7.29-8.88-9.145-11.265c-.928-1.193-3.314-4.374-6.362-4.772z"
						fill="currentColor"
						fill-rule="evenodd"
					/></svg
				>
			</Badge>,
			<Badge type="primary">
				{Math.round(properties.bike)}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					aria-hidden="true"
					role="img"
					class="iconify iconify--mdi"
					width="32"
					height="32"
					preserveAspectRatio="xMidYMid meet"
					viewBox="0 0 24 24"
					><path
						d="M5 20.5A3.5 3.5 0 0 1 1.5 17A3.5 3.5 0 0 1 5 13.5A3.5 3.5 0 0 1 8.5 17A3.5 3.5 0 0 1 5 20.5M5 12a5 5 0 0 0-5 5a5 5 0 0 0 5 5a5 5 0 0 0 5-5a5 5 0 0 0-5-5m9.8-2H19V8.2h-3.2l-1.94-3.27c-.29-.5-.86-.83-1.46-.83c-.47 0-.9.19-1.2.5L7.5 8.29C7.19 8.6 7 9 7 9.5c0 .63.33 1.16.85 1.47L11.2 13v5H13v-6.5l-2.25-1.65l2.32-2.35m5.93 13a3.5 3.5 0 0 1-3.5-3.5a3.5 3.5 0 0 1 3.5-3.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m0-8.5a5 5 0 0 0-5 5a5 5 0 0 0 5 5a5 5 0 0 0 5-5a5 5 0 0 0-5-5m-3-7.2c1 0 1.8-.8 1.8-1.8S17 1.2 16 1.2S14.2 2 14.2 3S15 4.8 16 4.8z"
						fill="currentColor"
					/></svg
				>
			</Badge>,
			<Badge type="primary">
				{Math.round(properties.car)}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					aria-hidden="true"
					role="img"
					class="iconify iconify--mdi"
					width="32"
					height="32"
					preserveAspectRatio="xMidYMid meet"
					viewBox="0 0 24 24"
					><path
						d="M16 6H6l-5 6v3h2a3 3 0 0 0 3 3a3 3 0 0 0 3-3h6a3 3 0 0 0 3 3a3 3 0 0 0 3-3h2v-3c0-1.11-.89-2-2-2h-2l-3-4M6.5 7.5h4V10h-6l2-2.5m5.5 0h3.5l1.96 2.5H12V7.5m-6 6A1.5 1.5 0 0 1 7.5 15A1.5 1.5 0 0 1 6 16.5A1.5 1.5 0 0 1 4.5 15A1.5 1.5 0 0 1 6 13.5m12 0a1.5 1.5 0 0 1 1.5 1.5a1.5 1.5 0 0 1-1.5 1.5a1.5 1.5 0 0 1-1.5-1.5a1.5 1.5 0 0 1 1.5-1.5z"
						fill="currentColor"
					/></svg
				>
			</Badge>
			en
			<Badge type="primary">
				{Math.round(properties.heavy)}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					aria-hidden="true"
					role="img"
					class="iconify iconify--mdi"
					width="32"
					height="32"
					preserveAspectRatio="xMidYMid meet"
					viewBox="0 0 24 24"
					><path
						d="M18 18.5a1.5 1.5 0 0 1-1.5-1.5a1.5 1.5 0 0 1 1.5-1.5a1.5 1.5 0 0 1 1.5 1.5a1.5 1.5 0 0 1-1.5 1.5m1.5-9l1.96 2.5H17V9.5m-11 9A1.5 1.5 0 0 1 4.5 17A1.5 1.5 0 0 1 6 15.5A1.5 1.5 0 0 1 7.5 17A1.5 1.5 0 0 1 6 18.5M20 8h-3V4H3c-1.11 0-2 .89-2 2v11h2a3 3 0 0 0 3 3a3 3 0 0 0 3-3h6a3 3 0 0 0 3 3a3 3 0 0 0 3-3h2v-5l-3-4z"
						fill="currentColor"
					/></svg
				>
			</Badge>
			gepasseerd.
		{/if}
		{#if isMetric && !isNotWorking}
			Hier scoorde {properties.name}
			{properties.metrics[properties.metric.name].rank}e<br />
			met {Math.round(properties.metrics[properties.metric.name].value * 100) / 100}
			{properties.metric.metricName}<br />
			tussen {previousDate}
			{previousHour} uur<br /> en {currentDate}
			{currentHour} uur
		{/if}
		{#if isMetric && isNotWorking}
			{properties.state}<br />
			Geen data voor<br />
			{properties.metric.name}
		{/if}
	</h5>
	<a href="https://telraam.net/nl/location/{properties.segment_id}">Toon me meer data...</a>
</div>
