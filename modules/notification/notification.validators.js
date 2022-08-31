const Joi = require('joi-oid');

module.exports = {
	add: {
		payload: Joi.object({
			entityType: Joi.string(),
			entity: Joi.string().optional(),
			message: Joi.string(),
			redirectUrl: Joi.string(),
			description: Joi.string().allow(''),
			notifyTo: Joi.array()
		})
	},

	listByNotifier: {
		params: Joi.object({
			userId: Joi.objectId()
		}),
		query: Joi.object({
			start: Joi.number().optional().allow(),
			limit: Joi.number().optional().allow()
		})
	},

	markAsRead: {
		params: Joi.object({
			id: Joi.objectId(),
			userId: Joi.objectId()
		})
	},

	markAllAsRead: {
		params: Joi.object({
			userId: Joi.objectId()
		})
	}
};
