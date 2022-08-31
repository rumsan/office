import React, { useEffect, useContext } from 'react';

import { TaskContext } from '../../../../contexts/TaskContext';
import { DailyTaskContext } from '../../../../contexts/DailyTaskContext';

import { useToasts } from 'react-toast-notifications';

import CustomSingleTask from '../../styledTask/CustomSingleTask';

function OutStandingTasks({ props }) {
	const { addToast } = useToasts();
	const { tasks, getDailyTasks } = useContext(TaskContext);
	const { addDailyTask, getMyDailyTasks } = useContext(DailyTaskContext);

	function fetchOutstandingTasks() {
		const query = { excludeTodays: true };

		getDailyTasks(query)
			.then(() => {})
			.catch(e => addToast('Something went wrong', { appearance: 'error', autoDismiss: true }));
	}
	function addToDailyTask(payload) {
		addDailyTask(payload)
			.then(() => {
				fetchOutstandingTasks();
				let query = { date: props && props.date ? props.date : '' };
				getMyDailyTasks(query);
				addToast('Task added in my daily task successfully', {
					autoDismiss: true,
					appearance: 'success'
				});
			})
			.catch(err => addToast('Something went wrong'), { appearance: 'error', autoDismiss: true });
	}

	useEffect(fetchOutstandingTasks, []);
	return (
		<>
			{tasks && tasks.length > 0 ? (
				tasks.reverse().map((item, index) => (
					<div key={index}>
						<CustomSingleTask item={item} index={index} addToDailyTask={addToDailyTask} />
					</div>
				))
			) : (
				<div>No Outstanding Tasks!!</div>
			)}
		</>
	);
}

export default OutStandingTasks;
