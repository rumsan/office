const mongoose = require('mongoose');

const { NotificationModel } = require('../models');
const { DataUtils } = require('../../helpers/utils');
const ws = require('../../helpers/utils/socket');

const { ObjectId } = mongoose.Types;

const Notification = {
	async add(payload) {
		if (!payload.entity) delete payload.entity;
		const { notifyTo } = payload;
		const notifiers = await this.createNotifiers(notifyTo);
		payload.notifyTo = notifiers;
		const doc = await NotificationModel.create(payload);
		// Send Notification
		await this.sendNotification(notifyTo);
		return doc;
	},

	async createNotifiers(data) {
		const users = data.split(',');
		return users.map(u => {
			return { userId: u };
		});
	},

	async sendNotification(notifiers) {
		if (!notifiers) throw Error('Please specify whom to notify.');
		const users = notifiers.split(',');
		users.map(async uId => {
			const doc = await this.listByNotifier({ userId: uId });
			if (doc && doc.data) {
				doc.action = 'LEAVE_REQUEST';
				ws.sendToClient(uId, doc);
			}
		});
	},

	listByNotifier({ start = 0, limit = 20, userId }) {
		return DataUtils.paging({
			start,
			limit,
			sort: { created_at: -1 },
			model: NotificationModel,
			query: [
				{
					$match: {
						notifyTo: {
							$elemMatch: {
								userId: ObjectId(userId),
								isRead: false
							}
						}
					}
				}
			]
		});
	},

	async removeByIdAndUser(notifId, userId) {
		await NotificationModel.updateOne({ _id: notifId }, { $pull: { notifyTo: { userId } } });
		return { status: 200, success: true, message: 'Notification deleted!' };
	},

	async markAsRead(id, userId) {
		const res = await NotificationModel.updateOne(
			{ _id: id, 'notifyTo.userId': ObjectId(userId) },
			{ $set: { 'notifyTo.$.isRead': true } },
			{ new: true }
		);
		return res;
	},

	async markAllAsRead(userId) {
		const res = await NotificationModel.updateMany(
			{ 'notifyTo.userId': ObjectId(userId) },
			{ $set: { 'notifyTo.$.isRead': true } },
			{ new: true }
		);
		return res;
	}
};

module.exports = {
	Notification,
	add: payload => Notification.add(payload),
	remove: req => {
		const { id } = req.params;
		const { userId } = req.payload;
		return Notification.removeByIdAndUser(id, userId);
	},
	listByNotifier: req => {
		const start = req.query && req.query.start ? req.query.start : 0;
		const limit = req.query && req.query.limit ? req.query.limit : 20;
		const { userId } = req.userId ? req : req.params;
		return Notification.listByNotifier({ start, limit, userId });
	},
	markAsRead: req => {
		const { id, userId } = req.params;
		return Notification.markAsRead(id, userId);
	},
	markAllAsRead: req => {
		const { userId } = req.params;
		return Notification.markAllAsRead(userId);
	}
};
