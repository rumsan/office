import API from '../constants/api';
import axios from 'axios';

import * as SessionManager from '../utils/sessionManager';

axios.defaults.headers.access_token = SessionManager.getUserToken();

export const fetchNotifications = async userId => {
	return new Promise((resolve, reject) => {
		axios
			.get(`${API.NOTIFICATIONS}/${userId}`)
			.then(res => {
				resolve(res.data);
			})
			.catch(err => {
				reject(err.response.data);
			});
	});
};

export const markNotificationAsRead = async (id, userId) => {
	return new Promise((resolve, reject) => {
		axios
			.put(`${API.NOTIFICATIONS}/read/${id}/${userId}`)
			.then(res => {
				resolve(res.data);
			})
			.catch(err => {
				reject(err.response.data);
			});
	});
};

export const markAllNotificationsAsRead = async userId => {
	return new Promise((resolve, reject) => {
		axios
			.put(`${API.NOTIFICATIONS}/read_all/${userId}`)
			.then(res => {
				resolve(res.data);
			})
			.catch(err => {
				reject(err.response.data);
			});
	});
};
