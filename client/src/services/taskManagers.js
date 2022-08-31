import API from '../constants/api';
import axios from 'axios';

import * as SessionManager from '../utils/sessionManager';

const access_token = SessionManager.getUserToken();

export const getMeisterProjects = async () => {
	const res = await axios.get(`${API.MEISTER_TASK_MANAGER}/projects`, { headers: { access_token } });
	return res.data;
};
export const getGitlabGroups = async () => {
	const res = await axios.get(`${API.GITLAB_TASK_MANAGER}/groups`, { headers: { access_token } });
	return res.data;
};

export const getMeisterTaskGroupProjects = async id => {
	const res = await axios.get(`${API.MEISTER_TASK_MANAGER}/projects/${id}/sections`, { headers: { access_token } });
	return res.data;
};
export const getGitlabGroupsProjects = async group_id => {
	const res = await axios.get(`${API.GITLAB_TASK_MANAGER}/groups/${group_id}/projects`, { headers: { access_token } });
	return res.data;
};
export const getGitlabProjectTasks = async project_id => {
	const res = await axios.get(`${API.GITLAB_TASK_MANAGER}/${project_id}/tasks`, { headers: { access_token } });
	return res.data;
};
export const getMeisterTaskProjectTasks = async id => {
	const res = await axios.get(`${API.MEISTER_TASK_MANAGER}/sections/${id}/tasks`, { headers: { access_token } });
	return res.data;
};
