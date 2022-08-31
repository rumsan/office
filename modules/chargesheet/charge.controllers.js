const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;
const moment = require('moment');
const { ChargeModel } = require('../models');
const { DataUtils } = require('../../helpers/utils');
const { UserController } = require('../user/user.controllers');

const Charge = {
	async add(data) {
		return ChargeModel.create(data);
	},
	async assignByManager(data) {
		return this.add(data);
	},
	update(id, payload) {
		return ChargeModel.findOneAndUpdate({ _id: id, is_archived: false }, payload, {
			new: true,
			runValidators: true
		});
	},
	getById(id) {
		return ChargeModel.findOne({ _id: id });
	},
	generateMatchQuery(params) {
		const query = [];
		const { date, search, projectId, user, project, startDate, endDate } = params;
		query.push(
			{
				$match: {
					is_archived: false
				}
			},
			{
				$sort: { created_at: -1 }
			},
			{
				$lookup: {
					from: 'projects',
					localField: 'project',
					foreignField: '_id',
					as: 'project'
				}
			},
			{
				$unwind: {
					path: '$project',
					preserveNullAndEmptyArrays: true
				}
			},
			{
				$lookup: {
					from: 'users',
					localField: 'created_by',
					foreignField: '_id',
					as: 'user'
				}
			},
			{
				$unwind: {
					path: '$user',
					preserveNullAndEmptyArrays: true
				}
			},
			{
				$addFields: {
					userName: { $concat: ['$user.name.first', ' ', '$user.name.last'] }
				}
			},
			{
				$project: {
					user: 0
				}
			}
		);
		if (project) {
			query.push({
				$match: {
					'project._id': ObjectId(project)
				}
			});
		}
		if (date) {
			query.push({
				$match: {
					date: {
						$gte: moment(date, 'YYYY-MM-DD').startOf('day').toDate(),
						$lte: moment(date, 'YYYY-MM-DD').endOf('day').toDate()
					}
				}
			});
		}
		if (startDate || endDate) {
			if (!startDate || !endDate) throw Error('Must send startDate and endDate');
			query.push({
				$match: {
					date: {
						$gte: new Date(startDate),
						$lte: new Date(endDate)
					}
				}
			});
		}
		if (user) {
			query.push({
				$match: {
					created_by: ObjectId(user)
				}
			});
		}
		if (search) query.push({ $match: { name: { $regex: new RegExp(`${search}`), $options: 'i' } } });
		if (projectId) query.push({ $match: { project: ObjectId(projectId) } });
		return query;
	},
	async list(params) {
		const { startDate, endDate, userStatus } = params;
		const query = Charge.generateMatchQuery(params);
		const chargeSheets = await ChargeModel.aggregate(query);
		let dailyUsers = [];
		if (startDate && endDate) {
			dailyUsers = await UserController.getEmployees({ status: userStatus });
		}
		return { chargeSheets, users: dailyUsers };
	},

	archive(id) {
		return ChargeModel.findByIdAndDelete(id);
	}
};

module.exports = {
	Charge,
	add: req => Charge.add(req.payload),
	assignByManager: req => Charge.assignByManager(req.payload),
	update: req => Charge.update(req.params.id, req.payload),
	getById: req => Charge.getById(req.params.id),
	list: req => {
		const search = req.query.search || '';
		const projectId = req.query.projectId || '';
		const date = req.query.date || null;
		const user = req.query.user || null;
		const project = req.query.project || null;
		const startDate = req.query.startDate || null;
		const endDate = req.query.endDate || null;
		const userStatus = req.query.userStatus || true;
		return Charge.list({
			date,
			search,
			projectId,
			user,
			project,
			startDate,
			endDate,
			userStatus
		});
	},
	archive: req => Charge.archive(req.params.id)
};
