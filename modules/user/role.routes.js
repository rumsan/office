const validators = require('./role.validators');
const controllers = require('./role.controllers');
const { USER, ROLE_ADMIN } = require('../../constants/permissions');

const routes = {
	add: ['POST', '', 'Add a new role', [ROLE_ADMIN, USER.ADMIN]],
	list: ['GET', '', 'Get all the roles', [ROLE_ADMIN, USER.ADMIN]],
	get: ['GET', '/{id}', 'Get a role by id', [ROLE_ADMIN, USER.ADMIN]],
	delete: ['DELETE', '/{id}', 'Delete a role by id', [ROLE_ADMIN, USER.ADMIN]],
	getPermissions: ['GET', '/{name}/permissions', 'Get permissions list by role', [ROLE_ADMIN, USER.ADMIN]],
	listAllPermissions: ['GET', '/permissions', 'Get all Permissions list', [ROLE_ADMIN, USER.ADMIN]],
	addPermissions: ['PATCH', '/{id}/permissions', 'Add permissions to a role', [ROLE_ADMIN, USER.ADMIN]],
	removePermissions: ['DELETE', '/{id}/permissions', 'Remove permissions from a role', [ROLE_ADMIN, USER.ADMIN]]
};

/**
 * Register the routes
 * @param {object} app Application.
 */
function register(app) {
	app.register({
		name: 'roles',
		routes,
		validators,
		controllers
	});
}

module.exports = register;
