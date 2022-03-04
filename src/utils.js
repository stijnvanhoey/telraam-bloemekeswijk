import { SegmentStateEnum, segmentProperties, MetricEnum } from './types';

/**
 * @function
 * @param records SegmentData
 * @return SegmentStateEnum
 */
export function getSegmentState(segmentData) {
	if (segmentData.pedestrian === '' && segmentData.last_data_package) {
		return SegmentStateEnum.INACTIVE;
	} else if (segmentData.pedestrian === '') {
		return SegmentStateEnum.NEW;
	}
	return SegmentStateEnum.ACTIVE;
}

/**
 * @function
 * @param metrics Array<RankingMetric>
 * @param decreasing bool (default: true)
 * @param customRankFunction function (default: null)
 * @return Array<RankingMetric>
 */
export function sortMetric(metrics, decreasing = true, customRankFunction = null) {
	let sorted = [];
	metrics.forEach((m, i) => {
		sorted[i] = { value: m?.value, index: i };
	});
	if (!decreasing) {
		sorted.sort((a, b) => {
			if (a === undefined) {
				return -10e6;
			} else if (b === undefined) {
				return 10e6;
			}
			return b.value - a.value;
		});
	} else {
		sorted.sort((a, b) => {
			if (a === undefined) {
				return 10e6;
			} else if (b === undefined) {
				return -10e6;
			}
			return a.value - b.value;
		});
	}
	let updatedMetrics = JSON.parse(JSON.stringify(metrics));
	let rank = 1;
	sorted.forEach((c) => {
		if (updatedMetrics[c.index]) {
			if (customRankFunction) {
				updatedMetrics[c.index].rank = customRankFunction(updatedMetrics[c.index].value);
			} else {
				updatedMetrics[c.index].rank = rank;
				rank += 1;
			}
		}
	});
	return updatedMetrics;
}

/**
 * @function
 * @param records Array<TrafficSnapshotData>
 * @return SegmentData
 */
export function aggregateTrafficSnapshotData(records) {
	if (!Array.isArray(records) || records.length === 0) {
		return {
			segment_id: 0,
			name: '',
			date: '',
			dateStart: '',
			dateEnd: '',
			pedestrian: 0,
			bike: 0,
			car: 0,
			heavy: 0,
			total_hours: 0,
			uptime: 0,
			metrics: {},
			state: '',
			last_data_package: ''
		};
	}
	const segment_id = records[0].segment_id;
	const out = {
		segment_id: segment_id,
		name: segmentProperties[segment_id]?.name || '',
		speed_limit: segmentProperties[segment_id]?.speed_limit || '',
		date: '',
		dateStart: records[0].date,
		dateEnd: records[records.length - 1].date,
		pedestrian: 0,
		bike: 0,
		car: 0,
		heavy: 0,
		total_hours: 0,
		uptime: 0,
		metrics: Object.values(MetricEnum)
			.filter((m) => m.name !== MetricEnum.NONE.name)
			.reduce(
				(dict, m) => ({
					...dict,
					[m.name]: {
						value: 0,
						rank: 0
					}
				}),
				{}
			),
		// current state, expecting chronological ordering
		state: getSegmentState(records[records.length - 1]),
		last_data_package: records[records.length - 1].last_data_package
	};
	records.forEach((rc) => {
		out.uptime += rc.uptime;
		if (rc.interval === 'hourly') {
			out.total_hours += 1;
		} else if (rc.interval === 'daily') {
			out.total_hours += 24;
		} else {
			console.error(`Unexpected interval value ${rc.interval} for segment ${segment_id}`);
		}
		out.pedestrian += rc.pedestrian;
		out.bike += rc.bike;
		out.car += rc.car;
		out.heavy += rc.heavy;
	});
	out.uptime /= records.length;
	Object.values(MetricEnum)
		.filter((m) => m.name !== MetricEnum.NONE.name)
		.forEach((m) => {
			out.metrics[m.name] = {
				value: m.computeMetric(records, out.speed_limit),
				rank: 0
			};
		});
	return out;
}

/**
 * @function
 * @param ms number delay in ms
 */
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * @function
 * @param urls Array<string>
 * @param delayMs number ms between calls
 * @param toJson boolean If true, await json
 * @return Array<any>
 */
export async function chainFetches(urls, delayMs = 0, toJson = true) {
	let responses = [];
	for (let url of urls) {
		if (toJson) {
			responses.push(await (await fetch(url)).json());
		} else {
			responses.push(await (await fetch(url)).text());
		}
		await delay(delayMs);
	}
	return responses;
}

/**
 * @function
 * @param feature RankingMetric
 * @param mt MetricProps
 * @return color hex
 */
export function colorFeatureMetric(feature, mt) {
	const featureValue = feature.properties.metrics?.[mt.name].value;
	if (featureValue === undefined || featureValue == 0 || isNaN(featureValue)) {
		return '#808080';
	}
	for (let { value, color } of mt.colormap) {
		if (mt.decreasing && featureValue > value) {
			return color;
		} else if (!mt.decreasing && featureValue < value) {
			return color;
		}
	}
	// outside of boundaries dictated by colormap
	return mt.colormap[mt.colormap.length - 1].color;
}
