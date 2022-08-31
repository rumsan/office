const Joi = require('joi-oid');

module.exports = {
	list: {},
	add: {
		payload: Joi.object({
			name: Joi.string(),
			email: Joi.string(),
			is_employee: Joi.boolean(),
			phone: Joi.string().example('9800000000'),
			password: Joi.string(),
			gender: Joi.string(),
			dob: Joi.date(),
			roles: Joi.array().items(Joi.string()),
			meister_id: Joi.string().optional(),
			team: Joi.string()
		}).label('User')
	},

	login: {
		payload: Joi.object({
			username: Joi.string().example('example@example.com'),
			password: Joi.string().example('password'),
			loginBy: Joi.string().example('email phone')
		})
	},
	loginWithGoogle: {
		payload: Joi.object({
			googleId: Joi.string(),
			email: Joi.string().example('example@example.com'),
			familyName: Joi.string(),
			givenName: Joi.string(),
			imageUrl: Joi.string(),
			name: Joi.string()
		})
	},
	register: {
		payload: Joi.object({
			name: Joi.string().required(),
			email: Joi.string().example('example@example.com').allow(''),
			phone: Joi.string().example('9800000000').required(),
			password: Joi.string().example('password').required(),
			picture: Joi.string(),
			province: Joi.string(),
			district: Joi.string(),
			municipality: Joi.string(),
			type: Joi.string().example('farmer trader serviceProvider'),
			storeName: Joi.string().allow(''),
			geo_location: {
				coordinates: Joi.array().items(Joi.number()).example([12.12, 13.13]).required()
			}
		})
	},
	findById: {
		params: Joi.object({
			id: Joi.objectId()
		})
	},
	findByOrgId: {
		params: Joi.object({
			id: Joi.objectId()
		})
	},
	update: {
		params: Joi.object({
			id: Joi.objectId()
		})
	},
	updateAppKeys: {
		payload: Joi.object({
			meistertask: Joi.string().allow(null, ''),
			gitlab: Joi.string().allow(null, '')
		})
	},
	removeRoles: {
		params: Joi.object({
			id: Joi.objectId()
		}),
		payload: Joi.object({
			roles: Joi.string()
		})
	},
	addRoles: {
		params: Joi.object({
			id: Joi.objectId()
		}),
		payload: Joi.object({
			roles: Joi.string().example('Farmer/Trader/Agro-Trader')
		})
	},
	updateStatus: {
		params: Joi.object({
			id: Joi.objectId()
		}),
		payload: Joi.object({
			status: Joi.string()
		})
	},
	forgotPassword: {
		payload: Joi.object({
			username: Joi.string()
		})
	},
	verifyResetToken: {
		params: Joi.object({
			token: Joi.string()
		})
	},
	resetPassword: {
		params: Joi.object({
			id: Joi.objectId()
		}),
		payload: Joi.object({
			password: Joi.string(),
			notify: Joi.string()
		})
	},
	changePassword: {
		params: Joi.object({
			id: Joi.objectId()
		}),
		payload: Joi.object({
			oldPassword: Joi.string(),
			newPassword: Joi.string()
		})
	}
};
