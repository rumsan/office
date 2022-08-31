import API from '../constants/api';
import axios from 'axios';
import qs from 'query-string';

import * as SessionManager from '../utils/sessionManager';

const access_token = SessionManager.getUserToken();

export const listRoles = async query => {
	const res = await axios.get(`${API.ROLE}?${qs.stringify(query)}`, { headers: { access_token } });
	return res.data;
};
