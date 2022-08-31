import React, { createContext, useReducer } from 'react';
import leaveReduce from '../reducers/leaveReducer';
import * as ACTIONS from '../actions/leave';
import * as SERVICE from '../services/leave';
const initialState = {
	list: [],
	pagination: { limit: 10, start: 0, total: 0, currentPage: 1, totalPages: 0 }
};

export const LeaveContext = createContext(initialState);
export const LeaveContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(leaveReduce, initialState);

	async function changeRequest(id, payload) {
		return SERVICE.changeRequest(id, payload);
	}
	async function deleteLeaveRequest(id) {
		return SERVICE.deleteLeaveRequest(id);
	}
	async function requestLeave(payload) {
		return SERVICE.requestLeave(payload);
	}
	async function listLeaveRequest(query) {
		const res = await SERVICE.listLeaveRequest(query);
		dispatch({ type: ACTIONS.LIST_LEAVE_REQUEST, data: res });
		return;
	}
	return (
		<LeaveContext.Provider
			value={{
				list: state.list,
				pagination: state.pagination,
				requestLeave,
				listLeaveRequest,
				changeRequest,
				deleteLeaveRequest
			}}
		>
			{children}
		</LeaveContext.Provider>
	);
};
