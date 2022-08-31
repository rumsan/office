const Joi = require('joi-oid');
const GooseJoi = require('../../helpers/utils/goosejoi');

module.exports = {
	add: {
		payload: Joi.object({
			project: Joi.objectId(),
			details: Joi.string(),
			date: Joi.date(),
			hours: Joi.number(),
			created_by: Joi.objectId()
		})
	},
	assignByManager: {
		payload: Joi.object({
			project: Joi.objectId(),
			details: Joi.string(),
			date: Joi.date(),
			hours: Joi.number(),
			created_by: Joi.objectId()
		})
	}
};
