/** Using types with JSDoc (compatible with VSCode Intellisense) */

/**
 * @typedef SegmentStateEnum
 * @enum {string}
 */
export const SegmentStateEnum = {
	ACTIVE: 'Actief',
	NEW: 'Recent toegevoegd, nog geen data beschikbaar',
	INACTIVE: 'Niet actief, geen data beschikbaar'
};

/**
 * @typedef {Object} SegmentData
 * @property {number} segment_id
 * @property {string} name
 * @property {number} speed_limit
 * @property {string} date
 * @property {number} pedestrian
 * @property {number} bike
 * @property {number} car
 * @property {number} heavy
 * @property {number} total_hours (only present in case of a traffic_snapshot call)
 * @property {number} uptime (only present in case of a traffic_snapshot call)
 * @property {RankingMetric} vulnerable_road_user_to_car_ratio (only present in case of a traffic_snapshot call)
 * @property {RankingMetric} too_fast_120_percent (only present in case of a traffic_snapshot call, 100-120% of speed limit)
 * @property {RankingMetric} too_fast_120_percent_plus (only present in case of a traffic_snapshot call, >120% of speed limit)
 * @property {SegmentStateEnum} state
 * @property {string} last_data_package
 */

/**
 * @typedef {Object} TrafficSnapshotData
 * @property {number} segment_id
 * @property {number} instance_id
 * @property {string} interval ("hourly" or "daily")
 * @property {string} timezone
 * @property {number} uptime
 * @property {number} v85
 * @property {number} direction (1 or 0, 1 is aligned with "virtual" segment direction)
 * @property {number} pedestrian (..._lft & _rgt also exist)
 * @property {number} bike (..._lft & _rgt also exist)
 * @property {number} car (..._lft & _rgt also exist)
 * @property {number} heavy (..._lft & _rgt also exist)
 * @property {Array<number>} car_speed_hist_0to70plus (bins of 10km/h - 0 to 7)
 * @property {Array<number>} car_speed_hist_0to120plus (bins of 5km/h - 0 to 24)
 * @property {string} last_data_package
 */

/**
 * @typedef {Object} RankingMetric
 * @property {number} value
 * @property {number} rank
 */

/**
 * @typedef {Object} SegmentGeoJSONData
 * @property {string} type
 * @property {Object} geometry geometry data
 * @property {SegmentData} properties
 */

/**
 * @typedef {Object} SegmentProperties
 * @property {string} name
 * @property {number} speed_limit
 */

// TODO - add API call to get location metadata instead of hardcoding
/** @type {Object.<number,string>} */
const streets = [
	529611, 9000000795, 9000002436, 9000003002, 9000003050, 9000003058, 9000003062, 9000003073,
	9000003081, 9000003094
];
export const segmentProperties = {
	9000002436: {
		name: 'Dahliastraat',
		speed_limit: 50 // TODO look up
	},
	9000000795: {
		name: 'Pannestraat',
		speed_limit: 50 // TODO look up
	},
	529611: {
		name: 'Gasmeterlaan',
		speed_limit: 50 // TODO look up
	},
	9000003002: {
		name: 'Mimosastraat',
		speed_limit: 50 // TODO look up
	},
	9000003050: {
		name: 'Fuchsiastraat',
		speed_limit: 50 // TODO look up
	},
	9000003058: {
		name: 'Klaverstraat',
		speed_limit: 50 // TODO look up
	},
	9000003062: {
		name: 'Dracenastraat',
		speed_limit: 50 // TODO look up
	},
	9000003073: {
		name: 'Grensstraat',
		speed_limit: 50 // TODO look up
	},
	9000003081: {
		name: 'Dahliastraat',
		speed_limit: 50 // TODO look up
	},
	9000003094: {
		name: 'Francisco Ferrerlaan',
		speed_limit: 50 // TODO look up
	}
};
