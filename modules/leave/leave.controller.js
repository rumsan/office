const config = require('config');
const moment = require('moment');
const mongoose = require('mongoose');

const Logger = require('../../helpers/logger');
const LeaveModel = require('./leave.model');
const GitlabService = require('../../helpers/services/gitlab');
const MeisterService = require('../../helpers/services/meistertask');
const Messenger = require('../../helpers/utils/messenger');
const { HR, TEAM_MANAGER } = require('../../constants/tempHR_RUMSAN');
const { DataUtils } = require('../../helpers/utils');
const { UserController } = require('../user/user.controllers');
const { Notification } = require('../notification/notification.controller');

const logger = Logger.getInstance();

const Gitlab = null;
const Meister = null;
const { ObjectId } = mongoose.Types;
function makeDateQuery(date) {
	if (!date) throw Error('Must send a date.');

	const selDate = moment(date, 'YYYY-MM-DD').startOf('day');

	return {
		$gte: selDate.toDate(),
		$lte: moment(selDate).endOf('day').toDate()
	};
}

const LeaveController = {
	async add(req) {
		const { _id: user, team, email: sender, name } = req.currentUser;
		const { reason, startDate, endDate, type } = req.payload;
		const teamManagers = TEAM_MANAGER.filter(mngr => mngr.team === team).map(manager => {
			return manager.email;
		});
		teamManagers.push(HR.email);
		const emailReceipients = teamManagers.toString();
		const newLeave = await LeaveModel.create({ user, reason, startDate, endDate, type });
		let notifyToWeb = await UserController.findByEmails(teamManagers);
		notifyToWeb = notifyToWeb.map(u => u._id);
		const webNotificationPayload = {
			entityType: 'LEAVE_REQUEST',
			message: 'New Leave Request',
			description: `${name.first} has requested for leave`,
			redirectUrl: '/leave',
			notifyTo: notifyToWeb.toString()
		};
		await Notification.add(webNotificationPayload);
		this.notifyUsers(
			{
				receiver: emailReceipients,
				sender,
				team,
				type,
				reason,
				startDate: moment(startDate).format('LL'),
				endDate: moment(endDate).format('LL'),
				title: 'Leave Request'
			},
			'leave_request'
		);
		return newLeave;
	},
	async changeRequestStatus(req) {
		const { id } = req.params;
		const { currentUser, payload } = req;
		const updatedLeave = await LeaveModel.findByIdAndUpdate(id, payload.payload, { new: true });
		req.params.id = updatedLeave.user;
		const user = await UserController.findById(req);
		this.notifyUsers(
			{
				sender: currentUser.name.full,
				type: updatedLeave.type,
				receiver_name: user.name.full,
				receiver: user.email,
				response: payload.payload.is_approved ? 'accepted' : 'rejected',
				startDate: moment(updatedLeave.startDate).format('LL'),
				endDate: moment(updatedLeave.endDate).format('LL'),
				title: 'Leave Request Response'
			},
			'leave_response'
		);
		return updatedLeave;
	},
	async delete(id) {
		return LeaveModel.findByIdAndRemove(id);
	},
	initializeServices(req) {
		try {
			this.curUser = req.sessionData.user;
			const appKeys = req.sessionData.user.app_keys || {};
			this.Gitlab = new GitlabService({ token: appKeys.gitlab, url: config.get('services.gitlab.url') });
			this.Meister = new MeisterService({
				token: appKeys.meistertask,
				url: config.get('services.meistertask.url')
			});
		} catch (e) {
			throw Error(e);
		}
	},

	async list({ date, email, user, start, limit }) {
		const query = [
			{
				$lookup: {
					from: 'users',
					localField: 'user',
					foreignField: '_id',
					as: 'user'
				}
			},
			{
				$unwind: {
					path: '$user',
					preserveNullAndEmptyArrays: false
				}
			},
			{
				$unset: ['user.password', 'user.social', 'user.app_keys', 'user.public_key']
			}
		];
		if (user) {
			query.push({
				$match: {
					'user._id': ObjectId(user)
				}
			});
		}
		if (date) {
			query.push({
				$match: {
					date: makeDateQuery(date)
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

		return DataUtils.paging({
			start,
			limit,
			sort: { created_at: -1 },
			model: LeaveModel,
			query
		});
	},

	async notifyUsers(res, template) {
		Messenger.send({
			to: res && res.receiver ? res.receiver : '',
			data: res,
			template
		});
	}
};
module.exports = {
	LeaveController,
	add: async req => {
		LeaveController.initializeServices(req);
		return LeaveController.add(req);
	},
	changeRequestStatus: async req => {
		return LeaveController.changeRequestStatus(req);
	},
	delete: async req => {
		const { id } = req.params;
		return LeaveController.delete(id);
	},
	list: async req => {
		const { date, email, user, start = 0, limit = 20 } = req.query;

		return LeaveController.list({ date, email, user, start, limit });
	}
};
