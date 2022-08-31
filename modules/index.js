const { Notification } = require('./notification/notification.controller');
const { Role } = require('./user/role.controllers');
const { User } = require('./user/user.controllers');

module.exports = {
	Notification,
	Role,
	User
};
