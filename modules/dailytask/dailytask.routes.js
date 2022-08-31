const validators = require('./dailytask.validators');
const controllers = require('./dailytask.controller');
const { USER, EMPLOYEE } = require('../../constants/permissions');

const routes = {
	add: ['POST', '', 'Create a task', [EMPLOYEE, USER.READ]],
	changeStatus: ['PUT', '/changeStatus/{id}', 'Change Daily Task Status', [EMPLOYEE, USER.READ]],
	listAll: ['GET', '/all/{date}', 'List all task', [EMPLOYEE, USER.READ]],
	list: ['GET', '', 'List my tasks', [EMPLOYEE, USER.READ]],
	remove: ['DELETE', '/{id}', 'Delete my task', [EMPLOYEE, USER.READ]]
};

/**
 * Register the routes
 * @param {object} app Application.
 */
function register(app) {
	app.register({
		name: 'dailyTask',
		routes,
		validators,
		controllers
	});
}

module.exports = register;
