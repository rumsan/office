const axios = require('axios');

module.exports = class {
	constructor(cfg) {
		Object.assign(this, cfg);
	}

	async request(cfg) {
		if (!this.token) {
			throw Error(
				"Please save your Gitlab personal access token in your profile.<br /><a href='/me'>Click Here for details.</a> "
			);
		}
		const config = {
			method: 'GET',
			headers: {
				'Private-Token': this.token
			},
			...cfg
		};
		config.url = `${this.url}${cfg.path}`;
		delete config.path;
		const { data } = await axios(config);
		return data;
	}

	listGroups() {
		return this.request({ path: '/groups?per_page=100' });
	}

	listProjectsByGroup(groupId) {
		return this.request({ path: `/groups/${groupId}/projects?per_page=100` });
	}

	listIssuesByProject(projectId) {
		return this.request({
			path: `/projects/${projectId}/issues?state=opened&per_page=50`
		});
	}

	createIssue(projectId, data) {
		return this.request({
			method: 'POST',
			path: `/projects/${projectId}/issues`,
			data
		});
	}

	changeIssueStatus(projectId, issueId, status) {
		status = status === 'open' ? 'reopen' : 'close';
		return this.request({
			method: 'PUT',
			path: `/projects/${projectId}/issues/${issueId}`,
			data: {
				state_event: status
			}
		});
	}
};
