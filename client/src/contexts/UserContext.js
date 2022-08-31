import React, { createContext, useReducer } from 'react';
import userReduce from '../reducers/userReducer';
import * as Service from '../services/users';
import * as ACTIONS from '../actions/user';
const initialState = {
	user_info: {},
	list: [],
	pagination: { limit: 10, start: 0, total: 0, currentPage: 1, totalPages: 0 }
};

export const UserContext = createContext(initialState);
export const UserContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(userReduce, initialState);

	async function addUser(payload) {
		const res = await Service.addUser(payload);
		dispatch({ type: ACTIONS.ADD_USER, data: res });
		return;
	}

	async function listUsers(query) {
		const res = await Service.listUsers(query);
		dispatch({ type: ACTIONS.LIST_ALL_USERS, data: res });
		return;
	}
	function userLogin(payload) {
		return Service.login(payload);
	}
	function googleLogin(payload) {
		return Service.loginWithGoogle(payload);
	}
	async function updateAppKey(payload) {
		const res = await Service.updateAppKeys(payload);
		return res;
	}
	async function updateUserDetails(id, payload) {
		return Service.updateUserDetails(id, payload);
	}
	async function updateMyDetails(payload) {
		return Service.updateMyDetails(payload);
	}
	async function getAppKeys() {
		const res = await Service.getAppKeys();
		return res;
	}
	async function changeStatus(id, status) {
		const res = await Service.changeStatus(id, status);
		dispatch({ type: ACTIONS.CHANGE_USER_STATUS, data: res });
		return res;
	}
	async function getUserInfo(id) {
		return Service.getUserInfo(id);
	}
	async function assignRoleToUser(id, roles) {
		return Service.assignRoleToUser(id, roles);
	}
	async function removeRoleFromUser(id, roles) {
		return Service.removeRoleFromUser(id, roles);
	}
	async function deleteExEmployee(id) {
		return Service.deleteExEmployee(id);
	}
	return (
		<UserContext.Provider
			value={{
				list: state.list,
				pagination: state.pagination,
				user_info: state.user_info,
				addUser,
				dispatch,
				userLogin,
				googleLogin,
				updateAppKey,
				getAppKeys,
				listUsers,
				changeStatus,
				getUserInfo,
				updateUserDetails,
				assignRoleToUser,
				removeRoleFromUser,
				deleteExEmployee,
				updateMyDetails
			}}
		>
			{children}
		</UserContext.Provider>
	);
};
