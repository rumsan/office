import React, { createContext, useReducer } from 'react';
import dailyTaskReduce from '../reducers/dailyTaskReducer';
import * as Service from '../services/dailyTasks';
import * as ACTIONS from '../actions/dailyTask';

const initialState = {
	daily_tasks: []
	// pagination: { limit: 10, start: 0, total: 0, currentPage: 1, totalPages: 0 }
};

export const DailyTaskContext = createContext(initialState);
export const DailyTaskContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(dailyTaskReduce, initialState);

	async function changeDailyTaskStatus(id, payload) {
		return Service.changeDailyTaskStatus(id, payload);
	}

	async function getAllDailyTask(date) {
		const res = await Service.getAllDailyTask(date);

		return res;
	}
	async function getMyDailyTasks(query) {
		const res = await Service.getMyDailyTask(query);
		dispatch({ type: ACTIONS.GET_MY_DAILY_TASKS, data: res });
		return res;
	}
	async function addDailyTask(payload) {
		return Service.addDailyTask(payload);
	}
	async function removeFromDailyTask(id) {
		return Service.removeFromDailyTask(id);
	}
	return (
		<DailyTaskContext.Provider
			value={{
				daily_tasks: state.daily_tasks,
				dispatch,
				getMyDailyTasks,
				changeDailyTaskStatus,
				addDailyTask,
				removeFromDailyTask,
				getAllDailyTask
			}}
		>
			{children}
		</DailyTaskContext.Provider>
	);
};
