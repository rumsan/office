const validators = require('./leave.validator');
const controllers = require('./leave.controller');
const { USER, EMPLOYEE } = require('../../constants/permissions');

const routes = {
	add: ['POST', '', 'Create leave request', [EMPLOYEE, USER.READ]],
	changeRequestStatus: ['PATCH', '/changeStatus/{id}', 'Change leave request status', [EMPLOYEE, USER.READ]],
	delete: ['DELETE', '/{id}', 'Delete leave request', [EMPLOYEE, USER.READ]],
	list: ['GET', '', 'Get leave request list', [EMPLOYEE, USER.READ]]
};

/**
 * Register the routes
 * @param {object} app Application.
 */
function register(app) {
	app.register({
		name: 'leaves',
		routes,
		validators,
		controllers
	});
}

module.exports = register;
