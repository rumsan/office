const auth = require('./user/auth.routes');
const charges = require('./chargesheet/charge.routes');
const crawl = require('./crawler/crawler.routes');
const dailyTask = require('./dailytask/dailytask.routes');
const leaves = require('./leave/leave.route');
const notification = require('./notification/notification.routes');
const project = require('./project/project.routes');
const role = require('./user/role.routes');
const tasks = require('./task/task.routes');
const user = require('./user/user.routes');

module.exports = {
	auth,
	charges,
	crawl,
	dailyTask,
	leaves,
	notification,
	project,
	role,
	tasks,
	user
};
