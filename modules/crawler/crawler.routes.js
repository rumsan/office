const { USER, EMPLOYEE } = require('../../constants/permissions');
const controllers = require('./crawler.controller');

const routes = {
	listProjects: ['GET', '/meistertask/projects', 'List All Meister Projects', [EMPLOYEE, USER.READ]],
	listSectionsByProject: [
		'GET',
		'/meistertask/projects/{id}/sections',
		'List sections by Project from Meister',
		[EMPLOYEE, USER.READ]
	],
	listTasksBySections: [
		'GET',
		'/meistertask/sections/{id}/tasks',
		'List meister task by sections',
		[EMPLOYEE, USER.READ]
	],
	listGroups: ['GET', '/gitlab/groups', 'List all gitlab groups', [EMPLOYEE, USER.READ]],
	listProjectsByGroup: [
		'GET',
		'/gitlab/groups/{group_id}/projects',
		'List Gitlab projects by group',
		[EMPLOYEE, USER.READ]
	],
	listIssuesByProject: ['GET', '/gitlab/{project_id}/tasks', 'List gitlab issues by project', [EMPLOYEE, USER.READ]]
};

/**
 * Register the routes
 * @param {object} app Application.
 */
function register(app) {
	app.register({
		name: 'crawl',
		routes,
		controllers
	});
}

module.exports = register;
