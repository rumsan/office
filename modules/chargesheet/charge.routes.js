const controllers = require('./charge.controllers');
const { USER, EMPLOYEE, ADMIN, MANAGER } = require('../../constants/permissions');
const validators = require('./charge.validators');

const routes = {
	add: ['POST', '', 'Add new Chargesheet record', [EMPLOYEE, USER.WRITE, MANAGER, ADMIN]],
	assignByManager: ['PUT', '/manager/assign', 'Assign Charge Hours by Manager', [USER.WRITE, MANAGER, ADMIN]],
	list: ['GET', '', 'List all charges', [USER.READ, EMPLOYEE, MANAGER, ADMIN]],
	getById: ['GET', '/{id}', 'Get an charge by id.', [USER.READ, EMPLOYEE, MANAGER, ADMIN]],
	update: ['PUT', '/{id}', 'Update the charge information', [USER.WRITE, EMPLOYEE, MANAGER, ADMIN]],
	archive: ['DELETE', '/{id}', 'Archive the charge', [USER.WRITE, MANAGER, EMPLOYEE]]
};

/**
 * Register the routes
 * @param {object} app Application.
 */
function register(app) {
	app.register({
		name: 'charges',
		routes,
		controllers,
		validators
	});
}

module.exports = register;
