const mongoose = require('mongoose');
const RSUser = require('rs-user');
const { ERR } = require('../../helpers/utils/error');

const { ObjectId } = mongoose.Schema;
const objectId = mongoose.Types.ObjectId;
const { DataUtils } = require('../../helpers/utils');
const { Role } = require('./role.controllers');
const SOCIALCONSTANTS = require('../../constants/socialLoginConstants');

const fnCreateSchema = (schema, collectionName) => {
	const userSchema = mongoose.Schema(schema, {
		collection: collectionName,
		timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
		toObject: { virtuals: true },
		toJSON: { virtuals: true }
	});
	return userSchema;
};

const User = new RSUser.User({
	mongoose,
	controllers: {
		role: Role
	},
	schema: {
		phone: { type: String, required: false, unique: true },
		entity: { type: ObjectId, ref: 'Entity' },
		address: { type: String },
		team: { type: String },
		app_keys: { type: Object, select: false },
		roles: { type: [String], default: ['Employee'] },
		is_new: { type: Boolean, default: true, select: true }
	},
	fnCreateSchema
});

const UserController = {
	User,
	async addRoles(request) {
		const userId = request.params.id;
		const { roles } = request.payload;
		const isValid = await Role.isValidRole(roles);
		if (!isValid) throw Error('role does not exist');
		return User.addRoles({ user_id: userId, roles });
	},
	async getAppKeys(request) {
		const appKeys = request.sessionData.user.app_keys || {};
		return appKeys;
	},

	list({ start, limit, sort, name, email, filter, paging = true, isActive }) {
		const query = [];
		query.push(
			{
				$addFields: { full_name: { $concat: ['$name.first', ' ', '$name.last'] } }
			},
			{
				$unset: ['password']
			}
		);
		if (filter) query.push({ $match: filter });
		if (name) {
			query.push({
				$match: {
					$or: [
						{
							full_name: {
								$regex: new RegExp(name, 'gi')
							}
						},
						{
							alias: {
								$regex: new RegExp(name, 'gi')
							}
						}
					]
				}
			});
		}

		if (email) {
			query.push({
				$match: {
					$or: [
						{
							email: {
								$regex: new RegExp(email, 'gi')
							}
						},
						{
							alias: {
								$regex: new RegExp(email, 'gi')
							}
						}
					]
				}
			});
		}
		if (isActive) {
			query.push({ $match: { is_active: true } });
		}

		sort = sort || { 'name.first': 1 };

		if (paging) {
			return DataUtils.paging({
				start,
				limit,
				sort,
				model: User.model,
				query
			});
		}

		query.push({ $sort: sort });
		return User.model.aggregate(query);
	},

	async login(request) {
		return User.authenticate(request.payload);
	},
	async loginWithGoogle(request) {
		const data = request.payload;
		const { email, name, ...social_data } = data;
		const options = { useEmailToFindUser: true };
		const loginData = {
			data: { email, name, social_data },
			service: SOCIALCONSTANTS.GOOGLE_APP_TYPE,
			service_id: data.googleId
		};
		return User.authenticateExternal(loginData, options);
	},

	async findById(request) {
		return User.model.findById(request.params.id).select('-password');
	},

	async findByOrgId(req) {
		const filter = {};
		const query = [];
		const start = req.query.start || 0;
		const limit = req.query.limit || 20;
		const sort = req.query.sort || { 'name.first': 1 };
		const name = req.query.name || '';
		const phone = req.query.phone || '';
		const orgId = req.params.id;

		if (name) filter.full_name = { $regex: new RegExp(`${name}`), $options: 'i' };
		if (phone) filter.phone = { $regex: new RegExp(`${phone}`), $options: 'i' };
		query.push(
			{
				$addFields: { full_name: { $concat: ['$name.first', ' ', '$name.last'] } }
			},
			{
				$unset: ['password']
			},
			{
				$match: {
					$and: [{ org_id: objectId(orgId) }, filter]
				}
			}
		);
		return DataUtils.paging({
			start,
			limit,
			sort,
			model: User.model,
			query
		});
	},

	async findByRoles(role) {
		return User.model.find({ roles: role }).select('-password');
	},

	async update(request) {
		const res = await User.update(request.params.id, request.payload, { new: true });
		return res;
	},
	async updateMyDetails(req) {
		const { currentUser, payload } = req.payload;
		const res = await User.update(currentUser._id, payload, { new: true });
		return res;
	},
	async updateAppKeys(request) {
		const id = request.sessionData.user._id;
		const { meistertask = '', gitlab = '' } = request.payload;
		const appKeys = { meistertask, gitlab };

		Object.entries(appKeys).forEach(([key, value]) => {
			appKeys[key] = value.trim();
		});

		return User.update(
			id,
			{
				app_keys: appKeys
			},
			{ new: true }
		);
	},

	async removeRoles(request) {
		const userId = request.params.id;
		const { roles } = request.payload;

		const isValid = await Role.isValidRole(roles);
		if (!isValid) throw Error('role does not exist');
		return User.removeRole({ user_id: userId, role: roles });
	},

	async updateStatus(request) {
		const userId = request.params.id;
		let { status } = request.payload;
		status = status === 'true';
		return User.changeStatus(userId, status);
	},

	async add(request) {
		const data = request.payload;
		const checkPhone = await User.model.findOne({ phone: data.phone });
		if (checkPhone) throw ERR.PHONE_EXISTS;
		if (data.email) {
			const checkEmail = await User.model.findOne({ email: data.email });
			if (checkEmail) throw ERR.EMAIL_EXISTS;
		}
		try {
			const user = await User.create(data);
			return user;
		} catch (e) {
			return e;
		}
	},

	async auth(request) {
		try {
			const token = request.query.access_token || request.headers.access_token || request.cookies.access_token;
			const { user, permissions } = await User.validateToken(token);

			return {
				user,
				permissions
			};
		} catch (e) {
			throw Error(`ERROR: ${e}`);
		}
	},

	register(request) {
		return controllers.add(request);
	},

	async forgotPassword(request) {
		const { username } = request.payload;
		const loginBy = username.includes('@') ? 'email' : 'phone';
		if (loginBy === 'email') {
			const checkEmail = await User.model.findOne({ email: username });
			if (!checkEmail) throw ERR.EMAIL_NOEXISTS;
		}
		if (loginBy === 'phone') {
			const checkPhone = await User.model.findOne({ phone: username });
			if (!checkPhone) throw ERR.PHONE_NOEXISTS;
		}
		return new Promise((resolve, reject) => {
			User.PasswordManager.forgotPassword(username, loginBy)
				.then(d => {
					resolve(d);
				})
				.catch(e => reject(e));
		});
	},

	resetPassword(request) {
		const userId = request.params.id;
		const { password, notify } = request.payload;
		return new Promise((resolve, reject) => {
			User.PasswordManager.resetPassword(userId, password, notify)
				.then(d => resolve(d))
				.catch(e => reject(e));
		});
	},

	verifyResetToken(request) {
		const { token } = request.params;
		return new Promise((resolve, reject) => {
			User.model
				.findOne({ user_token: token })
				.then(u => {
					const date = new Date();
					const expiresIn = date.setDate(date.getDate() + 1);
					if (u.token_expiration <= expiresIn) {
						resolve(u);
					} else {
						resolve({ msg: 'Token is expired' });
					}
				})
				.catch(e => reject(e));
		});
	},

	changePassword(request) {
		const userId = request.params.id;
		const { oldPassword, newPassword } = request.payload;
		return new Promise((resolve, reject) => {
			User.PasswordManager.changePassword(userId, oldPassword, newPassword)
				.then(d => resolve(d))
				.catch(e => reject(e));
		});
	},

	deleteExEmployee(id) {
		return new Promise((resolve, reject) => {
			User.model
				.findOneAndDelete({ _id: objectId(id), is_active: false })
				.then(d => resolve(d))
				.catch(e => reject(e));
		});
	},

	getEmployees({ status = true }) {
		const query = [
			{ $match: { is_active: status } },
			{ $addFields: { name: { $concat: ['$name.first', ' ', '$name.last'] } } },
			{ $project: { _id: 1, name: 1, team: 1 } }
		];
		return User.model.aggregate(query);
	},

	async findByEmails(emails) {
		return Promise.all(
			emails.map(e => {
				return User.model.findOne({ email: e }).select('id');
			})
		);
	}
};

module.exports = {
	User,
	UserController,
	add: req => UserController.add(req),
	addRoles: req => UserController.addRoles(req),
	auth: req => {
		return UserController.auth(req);
	},
	findById: req => UserController.findById(req),
	removeRoles: req => UserController.removeRoles(req),
	update: req => UserController.update(req),
	updateMyDetails: req => UserController.updateMyDetails(req),
	updateAppKeys: req => {
		return UserController.updateAppKeys(req);
	},
	updateStatus: req => UserController.updateStatus(req),
	login: req => {
		return UserController.login(req);
	},
	list: req => {
		const { start, limit, sort, filter, paging, name, email, is_active: isActive } = req.query;
		return UserController.list({ start, limit, sort, filter, paging, name, email, isActive });
	},
	loginWithGoogle: req => {
		return UserController.loginWithGoogle(req);
	},
	getAppKeys: req => {
		return UserController.getAppKeys(req);
	},
	deleteExEmployee: req => {
		return UserController.deleteExEmployee(req.params.id);
	}
};
