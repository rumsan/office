import axios from 'axios';
import qs from 'query-string';

const URL = process.env.REACT_APP_RUMSAN_ACCOUNT_URL;

export function getAllEntities() {
	const query = { limit: 100 };
	return new Promise((resolve, reject) => {
		axios
			.get(`${URL}/api/v1/entities?${qs.stringify(query)}`)
			.then(res => {
				resolve(res.data);
			})
			.catch(err => {
				reject(err.response.data);
			});
	});
}

export function getAllCustomers() {
	const query = { limit: 100 };
	return new Promise((resolve, reject) => {
		axios
			.get(`${URL}/api/v1/customers?${qs.stringify(query)}`)
			.then(res => {
				resolve(res.data);
			})
			.catch(err => {
				reject(err.response.data);
			});
	});
}
