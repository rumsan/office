import React from 'react';
import { DailyTaskContextProvider } from '../../contexts/DailyTaskContext';
import { TaskContextProvider } from '../../contexts/TaskContext';
import { TaskManagerContextProvider } from '../../contexts/TaskManagerContext';

import Dashboard from './Dashboard';

function index() {
	return (
		<TaskContextProvider>
			<DailyTaskContextProvider>
				<TaskManagerContextProvider>
					<Dashboard />
				</TaskManagerContextProvider>
			</DailyTaskContextProvider>
		</TaskContextProvider>
	);
}

export default index;
