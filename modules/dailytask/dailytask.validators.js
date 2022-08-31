const Joi = require('joi-oid');

module.exports = {
	changeStatus: {
		params: Joi.object({
			id: Joi.objectId()
		}),
		payload: Joi.object({
			status: Joi.string()
		})
	},
	listAll: {
		params: Joi.object({
			date: Joi.date()
		})
	},
	remove: {
		params: Joi.object({
			id: Joi.objectId()
		})
	}
};
