const controllers = require('./project.controllers');
const { USER, EMPLOYEE, MANAGER, ADMIN } = require('../../constants/permissions');
const validators = require('./project.validators');

const routes = {
	add: ['POST', '', 'Create project', [USER.WRITE, MANAGER, ADMIN]],
	list: ['GET', '', 'List all projects', [USER.WRITE, EMPLOYEE, MANAGER, ADMIN]],
	getById: ['GET', '/{id}', 'Get an project by id.', [USER.WRITE, MANAGER, ADMIN]],
	update: ['PUT', '/{id}', 'Update the project information', [USER.WRITE, MANAGER, ADMIN]],
	archive: ['DELETE', '/{id}', 'Archive the project', [USER.WRITE, MANAGER, ADMIN]],
	setup: ['GET', '/setup', 'Setup all default projects']
};

/**
 * Register the routes
 * @param {object} app Application.
 */
function register(app) {
	app.register({
		name: 'projects',
		routes,
		controllers,
		validators
	});
}

module.exports = register;
