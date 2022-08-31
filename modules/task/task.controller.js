const config = require('config');
const moment = require('moment');

const Logger = require('../../helpers/logger');
const { DataUtils } = require('../../helpers/utils');
const { TaskModel, DailyTaskModel } = require('./task.model');

const GitlabService = require('../../helpers/services/gitlab');
const MeisterService = require('../../helpers/services/meistertask');

const logger = Logger.getInstance();

const Gitlab = null;
const Meister = null;

function makeDateQuery(date) {
	if (!date) throw Error('Must send a date.');
	const selDate = moment(date, 'YYYY-MM-DD').startOf('day');
	return {
		$gte: selDate.toDate(),
		$lte: moment(selDate).endOf('day').toDate()
	};
}

const TaskController = {
	async add(req) {
		const { payload } = req;
		const { task } = payload;

		payload.assigned_by = payload.currentUser._id;
		if (payload.est_time < 10) throw new Error('Task cannot be less than 10 minutes.');
		if (payload.task.isNew) {
			if (payload.task.source === 'MeisterTask') {
				const data = await this.Meister.createTask(payload.task.sourceData.sectionId, { name: payload.task.name });
				payload.task.sourceData.taskId = data.id.toString();
				payload.task.sourceData.url = `https://www.meistertask.com/app/task/${data.token}`;
			}

			if (payload.task.source === 'Gitlab') {
				const data = await this.Gitlab.createIssue(payload.task.sourceData.projectId, { title: payload.task.name });

				payload.task.sourceData.taskId = data.iid.toString();
				payload.task.sourceData.url = data.web_url;
			}
		}
		if (!payload.task.sourceData.taskId) throw Error('Must send remote taskId');

		return TaskModel.create(task);
	},
	async archiveTask(id) {
		const res = await TaskModel.findByIdAndUpdate(id, { is_archived: true }, { new: true });

		return res;
	},

	remove(id) {
		return TaskModel.findByIdAndDelete(id);
	},

	async list({ start, limit, assigned_to, excludeTodays = false }) {
		let $match = {};
		if (assigned_to) $match = { assigned_to };
		else $match = { assigned_to: this.curUser._id };
		const query = [{ $match }];
		$match.status = { $ne: 'close' };

		if (excludeTodays) {
			let todayTasks = await DailyTaskModel.find({ date: makeDateQuery(new Date()) });
			todayTasks = todayTasks.map(d => d.task);
			$match._id = { $nin: todayTasks };
		}

		return DataUtils.paging({
			start,
			limit,
			sort: { created_at: 1 },
			model: TaskModel,
			query
		});
	},

	async changeStatus(req) {
		if (Gitlab === null) this.initializeServices(req);
		if (Meister === null) this.initializeServices(req);
		const task = await TaskModel.findById(req.params.id);
		if (task.source === 'Gitlab') {
			await this.Gitlab.changeIssueStatus(task.sourceData.projectId, task.sourceData.taskId, req.payload.status);
		}

		if (task.source === 'MeisterTask') {
			await this.Meister.changeTaskStatus(task.sourceData.taskId, req.payload.status);
		}

		task.status = req.payload.status;
		await task.save();
		return task;
	},

	getById(id) {
		return TaskModel.findById(id);
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
	}
};

module.exports = {
	TaskController,
	add: async req => {
		TaskController.initializeServices(req);
		return TaskController.add(req);
	},
	list: req => {
		TaskController.initializeServices(req);
		const limit = req.query.limit || 300;
		const start = req.query.start || 0;
		const search = req.query.search || null;
		const excludeTodays = req.query.excludeTodays === 'true';
		return TaskController.list({
			start,
			limit,
			search,
			excludeTodays
		});
	},
	getById: req => {
		TaskController.initializeServices(req);
		TaskController.getById(req.params.id);
	},
	changeStatus: req => {
		TaskController.initializeServices(req);
		TaskController.changeStatus(req);
	},
	update: async req => {
		TaskController.initializeServices(req);
		await TaskController.update(req.params.id, req.payload);
	},
	archiveTask: async req => {
		return TaskController.archiveTask(req.params.id);
	},
	remove: req => {
		TaskController.initializeServices(req);
		TaskController.remove(req.params.id);
	}
};
