import API from '../constants/api';
import axios from 'axios';
import qs from 'query-string';

import * as SessionManager from '../utils/sessionManager';

const access_token = SessionManager.getUserToken();

export const addDailyTask = payload => {
	return new Promise((resolve, reject) => {
		axios
			.post(`${API.DAILY_TASKS}`, payload, { headers: { access_token } })
			.then(res => {
				resolve(res.data);
			})
			.catch(err => reject(err));
	});
};

export const changeDailyTaskStatus = (id, status) => {
	return new Promise((resolve, reject) => {
		axios
			.put(`${API.DAILY_TASKS}/changeStatus/${id}`, { status }, { headers: { access_token } })
			.then(res => {
				const { data } = res;
				resolve(data);
			})
			.catch(error => reject(error));
	});
};

export const getMyDailyTask = query => {
	return new Promise((resolve, reject) => {
		axios
			.get(`${API.DAILY_TASKS}?${qs.stringify(query)}`, { headers: { access_token } })
			.then(res => {
				const { data } = res;
				resolve(data);
			})
			.catch(error => reject(error));
	});
};

export const getAllDailyTask = async date => {
	const res = await axios.get(`${API.DAILY_TASKS}/all/${date}`, { headers: { access_token } });
	return res.data;
};
export const removeFromDailyTask = id => {
	return new Promise((resolve, reject) => {
		axios
			.delete(`${API.DAILY_TASKS}/${id}`, { headers: { access_token } })
			.then(res => {
				const { data } = res;
				resolve(data);
			})
			.catch(error => reject(error));
	});
};
