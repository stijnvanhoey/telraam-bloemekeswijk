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

const computeVulnerableCarRatio = (records) => {
	let bike = 0;
	let car = 0;
	let heavy = 0;
	let pedestrian = 0;
	records.forEach((rc) => {
		pedestrian += rc.pedestrian;
		bike += rc.bike;
		car += rc.car;
		heavy += rc.heavy;
	});
	return (bike + pedestrian) / (car + heavy);
};

const computeTooFast20 = (records, speed_limit) => {
	let all_hist_values = 0;
	let too_fast = 0;
	records.forEach((rc) => {
		all_hist_values += rc.car_speed_hist_0to120plus.reduce((s, hist) => s + hist, 0);
		too_fast += rc.car_speed_hist_0to120plus.reduce(
			(s, hist, idx) =>
				s + ((idx + 1) * 5 > speed_limit && (idx + 1) * 5 <= 1.2 * speed_limit) * hist,
			0
		);
	});
	return (100 * too_fast) / all_hist_values;
};

const computeTooFast20Plus = (records, speed_limit) => {
	let all_hist_values = 0;
	let too_fast = 0;
	records.forEach((rc) => {
		all_hist_values += rc.car_speed_hist_0to120plus.reduce((s, hist) => s + hist, 0);
		too_fast += rc.car_speed_hist_0to120plus.reduce(
			(s, hist, idx) =>
				s + ((idx + 1) * 5 > speed_limit && (idx + 1) * 5 <= 1.2 * speed_limit) * hist,
			0
		);
	});
	return (100 * too_fast) / all_hist_values;
};

/**
 * @typedef MetricProps
 * @string name
 * @function computeMetric
 * @bool decreasing
 */

/**
 * @typedef MetricEnum
 * @enum {MetricProps}
 */
export const MetricEnum = {
	NONE: {
		name: 'Geen'
	},
	VULNERABLE_ROAD_USER_TO_CAR: {
		name: 'Zwakke weggebruikers/sterke weggebruikers',
		computeMetric: computeVulnerableCarRatio,
		decreasing: false,
		metricName: 'zwakke weggebruikers / voertuig'
	},
	TOO_FAST_120_PERCENT: {
		name: '< 20% boven snelheidslimiet',
		computeMetric: computeTooFast20,
		decreasing: true,
		metricName: '% van de voertuigen 1-20% boven snelheidslimiet'
	},
	TOO_FAST_120_PERCENT_PLUS: {
		name: '> 20% boven snelheidslimiet',
		computeMetric: computeTooFast20Plus,
		decreasing: true,
		metricName: '% van de voertuigen 21%-... boven snelheidslimiet'
	}
};
/**
 * @typedef {Object} SegmentData
 * @property {number} segment_id
 * @property {string} name
 * @property {number} speed_limit
 * @property {string} date
 * @property {string} dateStart (only present in case of a traffic_snapshot call)
 * @property {string} dateEnd (only present in case of a traffic_snapshot call)
 * @property {number} pedestrian
 * @property {number} bike
 * @property {number} car
 * @property {number} heavy
 * @property {number} total_hours (only present in case of a traffic_snapshot call)
 * @property {number} uptime (only present in case of a traffic_snapshot call)
 * @property {Object.<string, RankingMetric>} metrics (only present in case of a traffic_snapshot call)
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
	},
	9000003149: {
		name: 'Maïsstraat',
		speed_limit: 50 // TODO look up
	}
};
