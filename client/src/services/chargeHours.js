import API from '../constants/api';
import axios from 'axios';
import qs from 'query-string';

import * as SessionManager from '../utils/sessionManager';

axios.defaults.headers.access_token = SessionManager.getUserToken();

export const listChargeSheet = async query => {
	return new Promise((resolve, reject) => {
		axios
			.get(`${API.CHARGES}?${qs.stringify(query)}`)
			.then(res => {
				resolve(res.data);
			})
			.catch(err => {
				reject(err.response.data);
			});
	});
};

export const addChargeSheet = async payload => {
	return new Promise((resolve, reject) => {
		axios
			.post(`${API.CHARGES}`, payload)
			.then(res => {
				resolve(res.data);
			})
			.catch(err => {
				reject(err.response.data);
			});
	});
};

export const assignChargeHoursByManager = async payload => {
	return new Promise((resolve, reject) => {
		axios
			.put(`${API.CHARGES}/manager/assign`, payload)
			.then(res => {
				resolve(res.data);
			})
			.catch(err => {
				reject(err.response.data);
			});
	});
};

export const updateChargeSheet = async (id, payload) => {
	return new Promise((resolve, reject) => {
		axios
			.put(`${API.CHARGES}/${id}`, payload)
			.then(res => {
				resolve(res.data);
			})
			.catch(err => {
				reject(err.response.data);
			});
	});
};

export const deleteChargeSheet = async id => {
	return new Promise((resolve, reject) => {
		axios
			.delete(`${API.CHARGES}/${id}`)
			.then(res => {
				resolve(res.data);
			})
			.catch(err => {
				reject(err.response.data);
			});
	});
};
