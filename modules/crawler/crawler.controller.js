const config = require('config');
const Logger = require('../../helpers/logger');

const GitlabService = require('../../helpers/services/gitlab');
const MeisterService = require('../../helpers/services/meistertask');

const logger = Logger.getInstance();

const Gitlab = null;
const Meister = null;

const Crawler = {
	listProjects() {
		return this.Meister.listProjects();
	},

	listSectionsByProject(id) {
		return this.Meister.listSectionsByProject(id);
	},

	listTasksBySections(id) {
		return this.Meister.listTasksBySections(id);
	},

	listGroups() {
		return this.Gitlab.listGroups();
	},

	listProjectsByGroup(id) {
		return this.Gitlab.listProjectsByGroup(id);
	},

	listIssuesByProject(id) {
		return this.Gitlab.listIssuesByProject(id);
	},

	initializeServices(req) {
		try {
			this.curUser = req.sessionData.user;
			const appKeys = req.sessionData.user.app_keys || {};
			this.Gitlab = new GitlabService({ token: appKeys.gitlab, url: config.get('services.gitlab.url') });
			this.Meister = new MeisterService({
				token: appKeys.meistertask,
				url: config.get('services.meistertask.url')
			});
		} catch (e) {
			throw Error(e);
		}
	}
};

module.exports = {
	Crawler,
	listProjects: req => {
		Crawler.initializeServices(req);
		return Crawler.listProjects();
	},
	listSectionsByProject: req => {
		Crawler.initializeServices(req);
		return Crawler.listSectionsByProject(req.params.id);
	},
	listTasksBySections: req => {
		Crawler.initializeServices(req);
		return Crawler.listTasksBySections(req.params.id);
	},
	listGroups: req => {
		Crawler.initializeServices(req);
		return Crawler.listGroups();
	},
	listProjectsByGroup: req => {
		Crawler.initializeServices(req);
		return Crawler.listProjectsByGroup(req.params.group_id);
	},
	listIssuesByProject: req => {
		Crawler.initializeServices(req);
		return Crawler.listIssuesByProject(req.params.project_id);
	}
};
