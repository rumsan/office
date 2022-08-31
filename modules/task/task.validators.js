const Joi = require('joi-oid');

module.exports = {
	add: {
		payload: Joi.object({
			name: Joi.string(),
			source: Joi.string(),
			extId: Joi.string(),
			est_time: Joi.number(),
			sourceData: Joi.object(),
			status: Joi.string(),
			assigned_by: Joi.objectId(),
			assigned_to: Joi.objectId(),
			user_id: Joi.object(),
			date: Joi.date(),
			assigned_date: Joi.date()
		})
	},

	getById: {
		params: Joi.object({
			id: Joi.objectId()
		})
	},
	archiveTask: {
		params: Joi.object({
			id: Joi.objectId()
		})
	},
	update: {
		params: Joi.object({
			id: Joi.objectId()
		})
	},
	remove: {
		params: Joi.object({
			id: Joi.objectId()
		})
	},

	changeStatus: {
		params: Joi.object({
			id: Joi.objectId()
		}),
		payload: Joi.object({
			status: Joi.string()
		})
	}
};
