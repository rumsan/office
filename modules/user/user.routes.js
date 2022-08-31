const validators = require('./user.validators');
const controllers = require('./user.controllers');
const { USER, EMPLOYEE, MANAGER, ADMIN } = require('../../constants/permissions');

const routes = {
	add: ['POST', '', 'Add a new user', [USER.WRITE, USER.ADMIN]],
	getAppKeys: ['GET', '/appKeys', 'Get app keys', [EMPLOYEE, USER.READ]],
	list: ['GET', '', 'List all users', [USER.READ, MANAGER, USER.ADMIN, ADMIN]],
	login: ['POST', '/login', 'Login using username and password'],
	register: ['POST', '/register', 'Register new User'],
	findById: ['GET', '/{id}', 'Find a user by id', [EMPLOYEE, USER.READ, USER.ADMIN]],
	findByOrgId: ['GET', '/organization/{id}', 'Find users by organization id', [USER.READ, USER.ADMIN, MANAGER, ADMIN]],
	update: ['PATCH', '/{id}', 'Update user data', [USER.WRITE, EMPLOYEE]],
	updateMyDetails: ['PATCH', '', 'Update own user data', [USER.WRITE, EMPLOYEE]],
	updateAppKeys: ['PUT', '/updateAppKey', 'Update user app keys', [EMPLOYEE, USER.READ, USER.WRITE]],
	updateStatus: ['PATCH', '/{id}/status', 'Make user active or inactive', [USER.WRITE, USER.ADMIN, ADMIN]],
	addRoles: ['PATCH', '/{id}/roles', 'Add roles to a user', [USER.WRITE, USER.ADMIN, ADMIN]],
	removeRoles: ['DELETE', '/{id}/roles', 'Remove roles from user', [USER.WRITE, USER.ADMIN, ADMIN]],
	forgotPassword: ['POST', '/forgot_password', 'Forgot Password'],
	verifyResetToken: ['GET', '/password_reset/{token}', 'Verify Token'],
	resetPassword: ['POST', '/{id}/reset_password', 'Reset Password'],
	changePassword: ['POST', '/{id}/change_password', 'Change Password'],
	deleteExEmployee: ['DELETE', '/{id}/remove', 'Delete Ex Employee']
};

/**
 * Register the routes
 * @param {object} app Application.
 */
function register(app) {
	app.register({
		name: 'users',
		routes,
		validators,
		controllers
	});
}

module.exports = register;
