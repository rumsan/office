import API from '../constants/api';
import axios from 'axios';
import qs from 'query-string';

import * as SessionManager from '../utils/sessionManager';

const access_token = SessionManager.getUserToken();

export const getDailyTask = query => {
	return new Promise((resolve, reject) => {
		axios
			.get(`${API.TASKS}?${qs.stringify(query)}`, { headers: { access_token } })
			.then(res => resolve(res.data))
			.catch(error => reject(error));
	});
};

export const archeiveTasks = async (id, payload) => {
	const res = await axios.put(`${API.TASKS}/archieveTask/${id}`, payload, { headers: { access_token } });
	return res.data;
};
