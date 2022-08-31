import React, { createContext, useReducer } from 'react';
import chargeHoursReduce from '../reducers/chargeHoursReducer';
import * as Service from '../services/chargeHours';
import * as ACTION from '../actions/chargeHours';

const initialState = {
	list: [],
	pagination: { limit: 20, start: 0, total: 0 }
};

export const ChargeHoursContext = createContext(initialState);
export const ChargeHoursContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(chargeHoursReduce, initialState);

	async function listChargeSheet(query) {
		return new Promise((resolve, reject) => {
			Service.listChargeSheet(query)
				.then(res => {
					dispatch({ type: ACTION.GET_CHARGESHEET_LIST, res });
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
		});
	}

	async function addChargeSheet(payload) {
		return new Promise((resolve, reject) => {
			Service.addChargeSheet(payload)
				.then(res => {
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
		});
	}

	async function assignChargeHoursByManager(payload) {
		return new Promise((resolve, reject) => {
			Service.assignChargeHoursByManager(payload)
				.then(res => {
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
		});
	}

	async function updateChargeSheet(id, payload) {
		return new Promise((resolve, reject) => {
			Service.updateChargeSheet(id, payload)
				.then(res => {
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
		});
	}

	async function deleteChargeSheet(id) {
		return new Promise((resolve, reject) => {
			Service.deleteChargeSheet(id)
				.then(res => {
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
		});
	}

	return (
		<ChargeHoursContext.Provider
			value={{
				dispatch,
				pagination: state.pagination,
				list: state.list,
				listChargeSheet,
				addChargeSheet,
				updateChargeSheet,
				deleteChargeSheet,
				assignChargeHoursByManager
			}}
		>
			{children}
		</ChargeHoursContext.Provider>
	);
};
