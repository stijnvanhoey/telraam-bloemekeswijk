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
 * @property {string} segment_id
 * @property {string} name
 * @property {string} date
 * @property {number} pedestrian
 * @property {number} bike
 * @property {number} car
 * @property {number} heavy
 * @property {SegmentStateEnum} state
 * @property {string} last_data_package
 */

/**
 * @typedef {Object} SegmentGeoJSONData
 * @property {string} type
 * @property {Object} geometry geometry data
 * @property {SegmentData} properties
 */

// TODO - add API call to get location metadata instead of hardcoding
/** @type {Object.<number,string>} */
export const segmentNames = {
	9000003081: 'Dahliastraat',
	9000002436: 'Dahliastraat',
	9000000795: 'Pannestraat',
	529611: 'Gasmeterlaan',
	9000003002: 'Mimosastraat',
	9000003050: 'Fuchsiastraat',
	9000003058: 'Klaverstraat',
	9000003062: 'Dracenastraat',
	9000003073: 'Grensstraat',
	9000003094: 'Francisco Ferrerlaan'
};
