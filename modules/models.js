const ChargeModel = require('./chargesheet/charge.model');
const NotificationModel = require('./notification/notification.model');
const ProjectModel = require('./project/project.model');

function registerModels(database) {}

module.exports = {
	registerModels,
	ChargeModel,
	NotificationModel,
	ProjectModel
};
