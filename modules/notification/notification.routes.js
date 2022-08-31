const validators = require('./notification.validators');
const controllers = require('./notification.controller');
const { EMPLOYEE, ADMIN, MANAGER } = require('../../constants/permissions');

const routes = {
	add: ['POST', '', 'Create notification', [MANAGER, ADMIN]],
	remove: ['put', '/{id}', 'Delete notification', [MANAGER, ADMIN]],
	listByNotifier: ['GET', '/{userId}', 'List notifications by user', [MANAGER, ADMIN, EMPLOYEE]],
	markAsRead: [
		'PUT',
		'/read/{id}/{userId}',
		'Mark one notification as read for single user',
		[EMPLOYEE, ADMIN, MANAGER]
	],
	markAllAsRead: [
		'PUT',
		'/read_all/{userId}',
		'Mark all notifications as read for single user',
		[EMPLOYEE, ADMIN, MANAGER]
	]
};

function register(app) {
	app.register({
		name: 'notifications',
		routes,
		validators,
		controllers
	});
}

module.exports = register;
