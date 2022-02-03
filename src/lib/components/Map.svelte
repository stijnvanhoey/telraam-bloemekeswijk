<script>
	import {SegmentStateEnum} from '../../types';
	import { onMount } from 'svelte';
	import { browser } from '$app/env';
	import MapPopup from './MapPopup.svelte';

	export let snapshot;

	let streetStyle = {
		color: '#3cb371',
		weight: 10,
		opacity: 0.9
	};

	function bindPopup(layer, createFn) {
		let popupComponent;
		layer.bindPopup(
			() => {
				let container = L.DomUtil.create('div');
				popupComponent = createFn(container);
				return container;
			},
			{ minWidth: 375 }
		);

		layer.on('popupclose', () => {
			if (popupComponent) {
				let old = popupComponent;
				popupComponent = null;
				// Wait for the popup to completely fade out before destroying it.
				setTimeout(() => {
					old.$destroy();
				}, 500);
			}
		});
	}

	function onEachFeature(feature, layer) {
		// does this feature have a property named popupContent?
		if (feature.properties) {
			let properties = feature.properties;

			bindPopup(layer, (container) => {
				let c = new MapPopup({
					target: container,
					props: {
						properties
					}
				});
				return c;
			});

			// let popupMessage =
			//     `<div class='border border-danger padding-left-large padding-right-large background-danger shadow shadow-small'>
			//         <h4>${feature.properties.date} - ${feature.properties.segment_id}</h4>
			//         <h5>Hier zijn ${feature.properties.pedestrian} voetgangers en ${feature.properties.car} auto's gepasseerd</h5>
			//         <a href="https://telraam.net/nl/location/${feature.properties.segment_id}">Toon me meer data...</a>
			//     </div>`;

			// let isClicked = false;
			// layer.bindPopup(popupMessage, {closeButton:true});
			// layer.on('mouseover', function (e) {
			//     this.openPopup();
			// });
			// layer.on('mouseout', function (e) {
			//     if(!isClicked) {
			//         this.closePopup();
			//     }
			// });
			// layer.on('click', function (e) {
			//     isClicked = true;
			// })
			// layer.on('popupclose', function (e) {
			//     isClicked = false;
			// })
		}
	}

	function styleFeature(feature) {
		switch (feature.properties.state) {
			case SegmentStateEnum.ACTIVE:
				return streetStyle;
			case SegmentStateEnum.NEW:
				return { ...streetStyle, color: '#ffa500' };
			case SegmentStateEnum.INACTIVE:
				return { ...streetStyle, color: '#ff0000' };
			default:
				// unknown
				return { ...streetStyle, color: '#3cb371' };
		}
	}

	onMount(async () => {
		if (browser) {
			const leaflet = await import('leaflet');

			const map = leaflet.map('map', { minZoom: 13 }).setView([51.069, 3.703], 16);

			leaflet
				.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}', {
					attribution:
						'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
					subdomains: 'abcd',
					minZoom: 0,
					maxZoom: 18,
					ext: 'png'
				})
				.addTo(map);
			leaflet
				.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lines/{z}/{x}/{y}{r}.{ext}', {
					attribution:
						'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
					subdomains: 'abcd',
					minZoom: 0,
					maxZoom: 20,
					ext: 'png'
				})
				.addTo(map);

			// leaflet.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
			//     attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			//     subdomains: 'abcd',
			//     minZoom: 1,
			//     maxZoom: 16,
			//     ext: 'jpg'
			// }).addTo(map);

			leaflet
				.geoJSON(snapshot, {
					onEachFeature: onEachFeature,
					style: styleFeature
				})
				.addTo(map);
		}
	});
</script>

<main>
	<div id="map" class="map paper border border-primary" />
</main>

<style>
	@import 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
	main #map {
		height: 800px;
	}
</style>
