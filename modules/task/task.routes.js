const validators = require('./task.validators');
const controllers = require('./task.controller');
const { USER, EMPLOYEE } = require('../../constants/permissions');

const routes = {
	add: ['POST', '', 'Create a task', [EMPLOYEE, USER.READ]],
	archiveTask: ['PUT', '/archieveTask/{id}', 'Archieve Task', [EMPLOYEE, USER.READ]],
	list: ['GET', '', 'List all task', [EMPLOYEE, USER.READ]],
	getById: ['GET', '/{id}', 'Get task by id.', [EMPLOYEE, USER.READ]],
	update: ['PUT', '/{id}', 'Update the task', [EMPLOYEE, USER.READ]],
	remove: ['DELETE', '/{id}', 'Delete the task', [EMPLOYEE, USER.READ]],
	changeStatus: ['PUT', '/{id}/status', 'Change status of the task', [EMPLOYEE, USER.READ]]
};

/**
 * Register the routes
 * @param {object} app Application.
 */
function register(app) {
	app.register({
		name: 'tasks',
		routes,
		validators,
		controllers
	});
}

module.exports = register;
