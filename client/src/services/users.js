import API from '../constants/api';
import axios from 'axios';
import qs from 'query-string';

import * as SessionManager from '../utils/sessionManager';

const access_token = SessionManager.getUserToken();

export const addUser = async payload => {
	const res = await axios.post(API.USERS, payload, { headers: { access_token } });
	return res.data;
};

export const assignRoleToUser = async (id, roles) => {
	const res = await axios.patch(`${API.USERS}/${id}/roles`, { roles }, { headers: { access_token } });
	return res.data;
};

export const removeRoleFromUser = async (id, roles) => {
	const res = await axios.delete(`${API.USERS}/${id}/roles`, {
		headers: {
			access_token
		},
		data: {
			roles
		}
	});
	return res.data;
};
export const changeStatus = async (id, status) => {
	const res = await axios.patch(`${API.USERS}/${id}/status`, { status }, { headers: { access_token } });
	return res.data;
};
export const getUserInfo = async id => {
	const res = await axios.get(`${API.USERS}/${id}`, { headers: { access_token } });

	return res.data;
};
export const login = async payload => {
	const res = await axios.post(API.AUTH, payload);
	SessionManager.saveUserToken(res.data.accessToken);
	SessionManager.saveUser(res.data.user);
	SessionManager.saveUserRoles(res.data.user.roles);
	return res.data;
};
export const loginWithGoogle = async payload => {
	const res = await axios.post(`${API.AUTH}/googleLogin`, payload);
	SessionManager.saveUserToken(res.data.access_token);
	SessionManager.saveUser(res.data.user);
	SessionManager.saveUserRoles(res.data.user.roles);
	return res.data;
};

export function listUsers(query) {
	return new Promise((resolve, reject) => {
		axios
			.get(`${API.USERS}?${qs.stringify(query)}`, { headers: { access_token } })
			.then(res => {
				resolve(res.data);
			})
			.catch(e => reject(e.response.data));
	});
}

export function updateUserDetails(id, payload) {
	return new Promise((resolve, reject) => {
		axios
			.patch(`${API.USERS}/${id}`, payload, { headers: { access_token } })
			.then(res => {
				resolve(res.data);
			})
			.catch(e => reject(e.response.data));
	});
}
export function updateMyDetails(payload) {
	return new Promise((resolve, reject) => {
		axios
			.patch(`${API.USERS}`, { payload }, { headers: { access_token } })
			.then(res => {
				SessionManager.saveUser(res.data);
				resolve(res.data);
			})
			.catch(e => reject(e.response.data));
	});
}
export function updateAppKeys(payload) {
	return new Promise((resolve, reject) => {
		axios
			.put(`${API.USERS}/updateAppKey`, payload, { headers: { access_token } })
			.then(res => {
				SessionManager.saveUser(res.data);
				resolve();
			})
			.catch(e => reject(e.response.data));
	});
}
export function getAppKeys() {
	return new Promise((resolve, reject) => {
		axios
			.get(`${API.USERS}/appKeys`, { headers: { access_token } })
			.then(res => {
				resolve(res.data);
			})
			.catch(e => reject(e.response.data));
	});
}

export function deleteExEmployee(id) {
	return new Promise((resolve, reject) => {
		axios
			.delete(`${API.USERS}/${id}/remove`, { headers: { access_token } })
			.then(res => resolve(res.data))
			.catch(e => {
				reject(e.response.data);
			});
	});
}
