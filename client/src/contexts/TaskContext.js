import React, { createContext, useReducer } from 'react';
import taskReduce from '../reducers/taskReducer';
import * as Service from '../services/tasks';
import * as ACTIONS from '../actions/task';
const initialState = {
	tasks: [],
	pagination: { limit: 10, start: 0, total: 0, currentPage: 1, totalPages: 0 }
};

export const TaskContext = createContext(initialState);
export const TaskContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(taskReduce, initialState);

	async function getDailyTasks(query) {
		const res = await Service.getDailyTask(query);
		dispatch({ type: ACTIONS.GET_OUTSTANDING_TASK, data: res });
		return;
	}
	async function archeiveTasks(id, payload) {
		return Service.archeiveTasks(id, payload);
	}
	return (
		<TaskContext.Provider
			value={{
				tasks: state.tasks,
				pagination: state.pagination,
				dispatch,
				getDailyTasks,
				archeiveTasks
			}}
		>
			{children}
		</TaskContext.Provider>
	);
};
