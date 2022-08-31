const Joi = require('joi-oid');

module.exports = {
	add: {
		payload: Joi.object({
			reason: Joi.string(),
			startDate: Joi.date(),
			endDate: Joi.date(),
			type: Joi.string().example(['half day', 'full day'])
		})
	},
	changeRequestStatus: {
		params: Joi.object({
			id: Joi.objectId()
		})
	},
	delete: {
		params: Joi.object({
			id: Joi.objectId()
		})
	}
};
