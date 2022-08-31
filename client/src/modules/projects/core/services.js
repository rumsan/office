import axios from 'axios';

import API from '../../../constants/api';
import { getUserToken } from '../../../utils/sessionManager';

axios.defaults.headers.access_token = getUserToken();
const URL = `${API.PROJECTS}`;

export function list(params) {
	return new Promise((resolve, reject) => {
		axios({
			url: URL,
			params
		})
			.then(res => {
				resolve(res.data);
			})
			.catch(err => {
				reject(err.response.data);
			});
	});
}

export function get(id) {
	return new Promise((resolve, reject) => {
		axios(`${URL}/${id}`)
			.then(res => {
				resolve(res.data);
			})
			.catch(err => {
				reject(err.response.data);
			});
	});
}

export function add(payload) {
	return new Promise((resolve, reject) => {
		axios
			.post(URL, payload)
			.then(res => {
				resolve(res.data);
			})
			.catch(err => {
				reject(err.response.data);
			});
	});
}

export function update(id, payload) {
	return new Promise((resolve, reject) => {
		axios
			.put(`${URL}/${id}`, payload)
			.then(res => {
				resolve(res.data);
			})
			.catch(err => {
				reject(err.response.data);
			});
	});
}

export function remove(id) {
	return new Promise((resolve, reject) => {
		axios
			.delete(`${URL}/${id}`)
			.then(res => {
				if (res.statusText === 'OK') {
					resolve(res.data);
				}
				reject(res.data);
			})
			.catch(err => {
				reject(err.response.data);
			});
	});
}

export function addDefaultProjects(id) {
	return new Promise((resolve, reject) => {
		axios(`${URL}/setup`)
			.then(res => {
				if (res.statusText === 'OK') {
					resolve(res.data);
				}
				reject(res.data);
			})
			.catch(err => {
				reject(err.response.data);
			});
	});
}
