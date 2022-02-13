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
 * @return Array<RankingMetric>
 */
export function sortMetric(metrics, decreasing = true) {
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
			updatedMetrics[c.index].rank = rank;
			rank += 1;
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
