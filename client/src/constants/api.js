const server_url = process.env.REACT_APP_API_SERVER;
const base_url = server_url + '/api/v1';

module.exports = {
	AUTH: base_url + '/auth',
	CHARGES: base_url + '/charges',
	DAILY_TASKS: base_url + '/dailyTask',
	GITLAB_TASK_MANAGER: base_url + '/crawl/gitlab',
	LEAVE: base_url + '/leaves',
	MEISTER_TASK_MANAGER: base_url + '/crawl/meistertask',
	NOTIFICATIONS: base_url + '/notifications',
	PROJECTS: base_url + '/projects',
	ROLE: base_url + '/roles',
	TASKS: base_url + '/tasks',
	USERS: base_url + '/users'
};
