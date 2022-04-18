<script>
	import { MetricEnum, ErrorSegmentState } from '../../types';
	import { colorFeatureMetric, defaultColorMap } from '../../utils';
	import { onMount } from 'svelte';
	import { browser } from '$app/env';
	import MapPopup from './MapPopup.svelte';
	import '../../leaflet.legend.css';

	let leaflet;
	let map;
	let geoJSONLayer;
	let legendControl;
	export let snapshot;
	export let metric;

	const defaultColors = defaultColorMap();
	function updateMap(sn, mt) {
		if (leaflet && map) {
			if (geoJSONLayer) {
				map.removeLayer(geoJSONLayer);
			}
			geoJSONLayer = leaflet.geoJSON(sn, {
				onEachFeature: onEachFeature,
				style: (ft) => styleFeature(ft, mt)
			});
			geoJSONLayer.addTo(map);
			if (legendControl) {
				map.removeControl(legendControl);
			}
			let legendEntries = [];
			const legendEntry = (label, color) => ({
				label,
				type: 'rectangle',
				color,
				fillColor: color,
				weight: 2
			});
			if (mt.name === MetricEnum.NONE.name) {
				legendEntries = Object.entries(defaultColors)
					.filter(([k]) => k !== ErrorSegmentState)
					.map(([k, v]) => legendEntry(k, v.color));
			} else if (mt.decreasing) {
				let prevValue;
				legendEntries = mt.colormap.map(({ value, color }) => {
					let returnValue;
					if (prevValue === undefined) {
						returnValue = legendEntry(`waarde > ${value}${mt.metricUnit}`, color);
					} else {
						returnValue = legendEntry(
							`${prevValue}${mt.metricUnit} > waarde > ${value}${mt.metricUnit}`,
							color
						);
					}
					prevValue = value;
					return returnValue;
				});
			} else {
				let prevValue;
				legendEntries = mt.colormap.map(({ value, color }) => {
					let returnValue;
					if (prevValue === undefined) {
						returnValue = legendEntry(`waarde < ${value}${mt.metricUnit}`, color);
					} else {
						returnValue = legendEntry(
							`${prevValue}${mt.metricUnit} < waarde < ${value}${mt.metricUnit}`,
							color
						);
					}
					prevValue = value;
					return returnValue;
				});
			}
			legendControl = leaflet.control.Legend({
				position: 'bottomleft',
				title: 'Legende',
				collapsed: false,
				symbolWidth: 24,
				opacity: 1,
				column: 1,
				legends: legendEntries
			});
			legendControl.addTo(map);
		}
	}

	$: updateMap(snapshot, metric);

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
						properties: {
							...properties,
							metric
						}
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

	function styleFeatureNone(feature) {
		return defaultColors[feature.properties.state] || defaultColors[ErrorSegmentState];
	}

	function styleFeature(feature, mt) {
		if (mt.name === MetricEnum.NONE.name) {
			return styleFeatureNone(feature);
		}
		return { ...defaultColors[ErrorSegmentState], color: colorFeatureMetric(feature, mt) };
	}

	onMount(async () => {
		if (browser) {
			leaflet = await import('leaflet');
			await import('$lib/leaflet.legend');
			map = leaflet.map('map', { minZoom: 13 }).setView([51.069, 3.703], 16);

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
			updateMap(snapshot, metric);
		}
	});
	export function rerenderMap() {}
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
