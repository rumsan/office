import API from '../constants/api';
import axios from 'axios';
import qs from 'query-string';

import * as SessionManager from '../utils/sessionManager';

const access_token = SessionManager.getUserToken();

export const changeRequest = async (id, payload) => {
	const res = await axios.patch(`${API.LEAVE}/changeStatus/${id}`, { payload }, { headers: { access_token } });
	return res.data;
};
export const deleteLeaveRequest = async id => {
	const res = await axios.delete(`${API.LEAVE}/${id}`, { headers: { access_token } });
	return res;
};
export const listLeaveRequest = async query => {
	const res = await axios.get(`${API.LEAVE}?${qs.stringify(query)}`, { headers: { access_token } });
	return res.data;
};

export const requestLeave = async payload => {
	const res = await axios.post(API.LEAVE, payload, { headers: { access_token } });
	return res.data;
};
