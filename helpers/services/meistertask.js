const axios = require('axios');

module.exports = class Service {
	constructor(cfg) {
		Object.assign(this, cfg);
	}

	async request(cfg) {
		if (!this.token) {
			throw Error(
				"Please save your MeisterTask personal access token in your profile.<br /><a href='/me'>Click Here for details.</a> "
			);
		}
		const config = {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${this.token}`
			},
			...cfg
		};
		config.url = `${this.url}${cfg.path}`;
		delete config.path;
		const { data } = await axios(config);
		return data;
	}

	listProjects() {
		return this.request({ path: '/projects?sort=name' });
	}

	listSectionsByProject(projectId) {
		return this.request({ path: `/projects/${projectId}/sections?sort=name` });
	}

	listTasksBySections(sectionId) {
		return this.request({ path: `/sections/${sectionId}/tasks?sort=name&status=open` });
	}

	createTask(sectionId, data) {
		return this.request({
			method: 'POST',
			path: `/sections/${sectionId}/tasks`,
			data
		});
	}

	changeTaskStatus(taskId, status) {
		status = status === 'open' ? 1 : 2;
		return this.request({
			method: 'PUT',
			path: `/tasks/${taskId}`,
			data: {
				status
			}
		});
	}

	deleteTask(taskId) {
		return this.request({
			method: 'PUT',
			path: `/tasks/${taskId}`,
			data: {
				status: 8
			}
		});
	}
};
