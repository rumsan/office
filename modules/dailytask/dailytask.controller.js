const moment = require('moment');
const config = require('config');
const Logger = require('../../helpers/logger');
const { DataUtils } = require('../../helpers/utils');
const { TaskModel, DailyTaskModel } = require('../task/task.model');
const { UserDailyModel } = require('../user/user.daily.model');
const { UserController } = require('../user/user.controllers');
const { TaskController, add: TaskControllerAdd } = require('../task/task.controller');
const GitlabService = require('../../helpers/services/gitlab');
const MeisterService = require('../../helpers/services/meistertask');

const logger = Logger.getInstance();

const Gitlab = null;
const Meister = null;

function getWorkingMinutes({ start, end }) {
	try {
		start = moment(start, 'HH:mmA');
		end = moment(end, 'HH:mmA');
		let minutes = end.diff(start, 'minutes');
		if (minutes > 300) minutes -= 30;
		if (minutes > 420) minutes -= 30;
		return minutes;
	} catch (e) {
		return 420;
	}
}

function compareValues(key, order = 'asc') {
	return function innerSort(a, b) {
		// eslint-disable-next-line no-prototype-builtins
		if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
			return 0;
		}

		const varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key];
		const varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key];

		let comparison = 0;
		if (varA > varB) {
			comparison = 1;
		} else if (varA < varB) {
			comparison = -1;
		}
		return order === 'desc' ? comparison * -1 : comparison;
	};
}

function makeDateQuery(date) {
	if (!date) throw Error('Must send a date.');

	const selDate = moment(date, 'YYYY-MM-DD').startOf('day');

	return {
		$gte: selDate.toDate(),
		$lte: moment(selDate).endOf('day').toDate()
	};
}

const taskLookup = (field = 'task') => [
	{
		$lookup: {
			from: 'tasks',
			localField: field,
			foreignField: '_id',
			as: field
		}
	},
	{
		$unwind: {
			path: `$${field}`,
			preserveNullAndEmptyArrays: true
		}
	},
	{
		$match: {
			$or: [{ 'task.is_archived': false }, { 'task.is_archived': undefined }]
		}
	}
];

const DailyTask = {
	async add(req) {
		const { payload } = req;

		let { task } = payload;

		payload.task.assigned_to = payload.task.assigned_to || req.currentUser._id;

		if (!task._id) task = await TaskControllerAdd(req);

		return DailyTask.addExisting({
			date: payload.date,
			task: task._id,
			user: payload.task.assigned_to
		});
	},
	async addExisting({ date, task, user }) {
		user = user || this.curUser._id;
		const dailyTask = await DailyTaskModel.create({ date, task, user });
		return dailyTask.populate('task').execPopulate();
	},
	async changeStatus(req) {
		const { id } = req.params;
		const { status } = req.payload;

		if (!(status === 'incomplete' || status === 'complete')) {
			throw Error('Status must be either incomplete or complete');
		}
		const dailytask = await DailyTaskModel.findById(id);

		const taskStatus = status === 'incomplete' ? 'open' : 'close';

		req.payload = { status: taskStatus };
		req.params = { id: dailytask.task };

		await TaskController.changeStatus(req);
		dailytask.status = status;
		await dailytask.save();
		return dailytask;
	},

	async listDailyUsers(date) {
		// query that returns list of users that are created before today

		// [
		// 	{
		// 		'$lookup': {
		// 			'from': 'users',
		// 			'localField': 'user',
		// 			'foreignField': '_id',
		// 			'as': 'string'
		// 		}
		// 	}, {
		// 		'$unwind': {
		// 			'path': '$string',
		// 			'preserveNullAndEmptyArrays': false
		// 		}
		// 	}, {
		// 		'$addFields': {
		// 			' user_created_at': '$string.created_at'
		// 		}
		// 	}, {
		// 		'$match': {
		// 			'$expr': {
		// 				'$gt': [
		// 					new Date(), 'user_created_at'
		// 				]
		// 			}
		// 		}
		// 	}
		// ]
		const selDate = moment(date, 'YYYY-MM-DD').startOf('day');

		let dailyUsers = await UserDailyModel.find({
			date: makeDateQuery(date)
		})
			.populate('user', 'name team')
			.lean();

		if (!dailyUsers.length) {
			let users = await UserController.list({ paging: false, filter: { is_active: true } });
			users = users.map(u => {
				u.scheduled = u.scheduled || {};
				if (!u.scheduled.start) u.scheduled = { start: '10:00AM', end: '6:00PM' };
				return {
					date: selDate.format('YYYY-MM-DD'),
					user: u._id,
					scheduled: u.scheduled,
					status: 'regular',
					scheduled_minutes: getWorkingMinutes(u.scheduled)
				};
			});
			await UserDailyModel.insertMany(users);
			dailyUsers = await UserDailyModel.find({
				date: makeDateQuery(date)
			})
				.populate('user', 'name team')
				.lean();
		}

		dailyUsers = dailyUsers.map(u => ({
			date: u.date,
			_id: u.user._id,
			name: `${u.user.name.first} ${u.user.name.last}`,
			team: u.user.team,
			scheduled: u.scheduled,
			status: u.status,
			scheduled_minutes: u.scheduled_minutes
		}));

		return dailyUsers.sort(compareValues('name'));
	},
	async listAll({ date }) {
		const query = [
			{
				$match: {
					date: makeDateQuery(date)
				}
			},
			{
				$lookup: {
					from: 'tasks',
					localField: 'task',
					foreignField: '_id',
					as: 'task'
				}
			},
			{
				$unwind: {
					path: '$task',
					preserveNullAndEmptyArrays: true
				}
			}
		];

		const dailyTasks = await DailyTaskModel.aggregate(query);

		const users = await DailyTask.listDailyUsers(date);

		return { daily_tasks: dailyTasks, users };
	},

	list({ date }) {
		date = date || moment().format('YYYY-MM-DD');
		let query = [
			{
				$match: {
					date: makeDateQuery(date),
					user: this.curUser._id
				}
			}
		];
		query = [...query, ...taskLookup()];
		query.push({
			$sort: { created_at: 1 }
		});

		return DailyTaskModel.aggregate(query);
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
	remove(req) {
		const { id } = req.params;
		return DailyTaskModel.findByIdAndDelete(id);
	}
};

module.exports = {
	DailyTask,
	add: req => {
		DailyTask.initializeServices(req);
		return DailyTask.add(req);
	},
	changeStatus: req => {
		DailyTask.initializeServices(req);
		return DailyTask.changeStatus(req);
	},
	list: req => {
		DailyTask.initializeServices(req);
		const { date } = req.query;
		return DailyTask.list({
			date
		});
	},
	listAll: req => {
		DailyTask.initializeServices(req);

		const { date } = req.params;
		return DailyTask.listAll({
			date
		});
	},
	remove: req => {
		DailyTask.initializeServices(req);
		return DailyTask.remove(req);
	}
};
