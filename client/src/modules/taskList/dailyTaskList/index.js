import React from 'react';
import DailyTaskList from './DailyTaskList';
import { DailyTaskContextProvider } from '../../../contexts/DailyTaskContext';
import { TaskManagerContextProvider } from '../../../contexts/TaskManagerContext';

function index() {
	return (
		<TaskManagerContextProvider>
			<DailyTaskContextProvider>
				<DailyTaskList />
			</DailyTaskContextProvider>
		</TaskManagerContextProvider>
	);
}

export default index;
