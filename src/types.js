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
export const ErrorSegmentState = 'Onverwacht';

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

const computeCorrectSpeedRatio = (records, speed_limit) => {
	let all_hist_values = 0;
	let too_fast = 0;
	records.forEach((rc) => {
		all_hist_values += rc.car_speed_hist_0to120plus.reduce((s, hist) => s + hist, 0);
		too_fast += rc.car_speed_hist_0to120plus.reduce(
			(s, hist, idx) => s + ((idx + 1) * 5 <= speed_limit) * hist,
			0
		);
	});
	return (100 * too_fast) / all_hist_values;
};

const computeSpeedingViolationSpeed = (records, speed_limit) => {
	let aggregate_violation_number = 0;
	let aggregate_violation_speed = 0;
	records.forEach((rc) => {
		aggregate_violation_number += rc.car_speed_hist_0to120plus.reduce(
			(s, hist, idx) => s + ((idx + 1) * 5 > speed_limit) * hist,
			0
		);
		aggregate_violation_speed += rc.car_speed_hist_0to120plus.reduce(
			(s, hist, idx) => s + ((idx + 1) * 5 > speed_limit) * (idx + 1) * 5 * hist,
			0
		);
	});
	return aggregate_violation_speed / aggregate_violation_number - speed_limit;
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
		showSpeedLimit: false,
		metricName: 'zwakke weggebruikers / voertuig',
		metricUnit: '',
		colormap: [
			{
				value: 0.2,
				color: '#ff0000'
			},
			{
				value: 0.4,
				color: '#ff5349'
			},
			{
				value: 0.6,
				color: '#fa500'
			},
			{
				value: 0.8,
				color: '#ffae42'
			},
			{
				value: 1,
				color: '#ffff00'
			},
			{
				value: 1.2,
				color: '#9acd32'
			}
		]
	},
	RATIO_SPEEDING_VIOLATION: {
		name: '% chauffeurs binnen snelheidslimiet',
		computeMetric: computeCorrectSpeedRatio,
		decreasing: false,
		showSpeedLimit: true,
		metricName: '% van de chauffeurs binnen de snelheidslimiet',
		metricUnit: '%',
		colormap: [
			{
				value: 65,
				color: '#ff0000'
			},
			{
				value: 70,
				color: '#ff5349'
			},
			{
				value: 75,
				color: '#fa500'
			},
			{
				value: 80,
				color: '#ffae42'
			},
			{
				value: 85,
				color: '#ffff00'
			},
			{
				value: 90,
				color: '#9acd32'
			}
		]
	},
	SPEEDING_VIOLATION_SPEED: {
		name: 'Gemiddelde snelheid bij snelheidsovertreding',
		computeMetric: computeSpeedingViolationSpeed,
		decreasing: true,
		showSpeedLimit: true,
		metricName: 'km/u boven snelheidslimiet',
		metricUnit: 'km/u',
		colormap: [
			{
				value: 25,
				color: '#ff0000'
			},
			{
				value: 20,
				color: '#ff5349'
			},
			{
				value: 15,
				color: '#fa500'
			},
			{
				value: 10,
				color: '#ffae42'
			},
			{
				value: 5,
				color: '#ffff00'
			},
			{
				value: 0,
				color: '#9acd32'
			}
		]
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
		speed_limit: 30
	},
	9000000795: {
		name: 'Pannestraat',
		speed_limit: 30
	},
	529611: {
		name: 'Gasmeterlaan',
		speed_limit: 50
	},
	9000003002: {
		name: 'Mimosastraat',
		speed_limit: 30
	},
	9000003050: {
		name: 'Fuchsiastraat',
		speed_limit: 30
	},
	9000003058: {
		name: 'Klaverstraat',
		speed_limit: 30
	},
	9000003062: {
		name: 'Dracenastraat',
		speed_limit: 50
	},
	9000003073: {
		name: 'Grensstraat',
		speed_limit: 30
	},
	9000003081: {
		name: 'Dahliastraat',
		speed_limit: 30
	},
	9000003094: {
		name: 'Francisco Ferrerlaan',
		speed_limit: 50
	},
	9000003149: {
		name: 'Maïsstraat',
		speed_limit: 30
	},
	9000003136: {
		name: 'Anjelierstraat',
		speed_limit: 30
	},
	9000003246: {
		name: 'Frans Van Ryhovelaan',
		speed_limit: 30
	},
	9000003275: {
		name: 'Maïsstraat',
		speed_limit: 30
	},
	9000003278: {
		name: 'Poperingestraat',
		speed_limit: 30
	},
	9000003281: {
		name: 'Maïsstraat',
		speed_limit: 30
	},
	9000003286: {
		name: 'Dikkelindestraat',
		speed_limit: 30
	},
	9000003324: {
		name: 'Lisbloemstraat',
		speed_limit: 30
	},
	9000003502: {
		name: 'Jasmijnstraat',
		speed_limit: 30
	}
};
