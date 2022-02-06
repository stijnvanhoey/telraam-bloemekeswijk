import { SegmentStateEnum, segmentProperties } from './types';

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
 * @param records Array<TrafficSnapshotData>
 * @return SegmentData
 */
export function aggregateTrafficSnapshotData(records) {
	if (!Array.isArray(records) || records.length === 0) {
		return {
			segment_id: 0,
			name: '',
			date: '',
			pedestrian: 0,
			bike: 0,
			car: 0,
			heavy: 0,
			total_hours: 0,
			uptime: 0,
			vulnerable_road_user_to_car_ratio: null,
			too_fast_120_percent: null,
			too_fast_120_percent_plus: null,
			state: '',
			last_data_package: ''
		};
	}
	const segment_id = records[0].segment_id;
	const total_uptime = records.reduce((sum, rc) => sum + rc.uptime, 0);
	const total_hours = records.reduce((sum, rc) => {
		if (rc.interval === 'hourly') {
			sum += 1;
		} else if (rc.interval === 'daily') {
			sum += 24;
		} else {
			console.error(`Unexpected interval value ${rc.interval} for segment ${segment_id}`);
		}
		return sum;
	}, 0);
	const out = {
		segment_id: segment_id,
		name: segmentProperties[segment_id]?.name || '',
		speed_limit: segmentProperties[segment_id]?.speed_limit || '',
		date: records[-1]?.speed_limit,
		pedestrian: 0,
		bike: 0,
		car: 0,
		heavy: 0,
		total_hours: 0,
		uptime: 0,
		vulnerable_road_user_to_car_ratio: {
			value: 0,
			rank: 0
		},
		too_fast_120_percent: {
			value: 0,
			rank: 0
		},
		too_fast_120_percent_plus: {
			value: 0,
			rank: 0
		},
		// current state, expecting chronological ordering
		state: getSegmentState(records[records.length - 1]),
		last_data_package: records[records.length - 1].last_data_package
	};
	let all_hist_values = 0;
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
		all_hist_values += rc.car_speed_hist_0to120plus.reduce((s, hist) => s + hist, 0);
		out.too_fast_120_percent.value += rc.car_speed_hist_0to120plus.reduce(
			(s, hist, idx) =>
				s + ((idx + 1) * 5 > out.speed_limit && (idx + 1) * 5 <= 1.2 * out.speed_limit) * hist,
			0
		);
		out.too_fast_120_percent_plus.value = rc.car_speed_hist_0to120plus.reduce(
			(s, hist, idx) => s + ((idx + 1) * 5 > 1.2 * out.speed_limit) * hist,
			0
		);
	});
	out.uptime /= records.length;
	out.too_fast_120_percent.value /= all_hist_values;
	out.too_fast_120_percent_plus.value /= all_hist_values;
	out.vulnerable_road_user_to_car_ratio.value = (out.bike + out.pedestrian) / (out.car + out.heavy);
	return out;
}
