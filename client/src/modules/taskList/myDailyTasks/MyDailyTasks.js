import React, { useState, useEffect, useContext } from 'react';
import { DailyTaskContext } from '../../../contexts/DailyTaskContext';
import { TaskContext } from '../../../contexts/TaskContext';
import { useToasts } from 'react-toast-notifications';
import CustomSingleTask from '../styledTask/CustomSingleTask';
function MyDailyTasks({ props }) {
	const { date } = props;
	const { addToast } = useToasts();

	const [statusChanging, setStatusChanging] = useState(null);

	const { daily_tasks, getMyDailyTasks, changeDailyTaskStatus, removeFromDailyTask } = useContext(DailyTaskContext);
	const { getDailyTasks, archeiveTasks } = useContext(TaskContext);

	function fetchMyDailyTask() {
		if (!date) return;
		const query = { date };
		getMyDailyTasks(query)
			.then()
			.catch(e => addToast('Something went wrong', { appearance: 'error', autoDismiss: true }));
	}
	function changeTaskStatus(taskId, status) {
		setStatusChanging({ id: taskId, isChanging: true });
		changeDailyTaskStatus(taskId, status)
			.then(() => {
				addToast('Task Status changed', { appearance: 'success', autoDismiss: true });
				setStatusChanging({ id: taskId, isChanging: false });
				fetchMyDailyTask();
			})
			.catch(e => {
				setStatusChanging({ id: taskId, isChanging: false });
				addToast('Something went wrong', { appearance: 'error', autoDismiss: true });
			});
	}
	function removeFromMyTask(id) {
		removeFromDailyTask(id)
			.then(() => {
				addToast('Task removed successfully', { appearance: 'success', autoDismiss: true });
				fetchMyDailyTask();
				getDailyTasks();
			})
			.catch(err => {
				addToast('Something went wrong', { appearance: 'error', autoDismiss: true });
			});
	}
	function archeiveTask(id) {
		archeiveTasks(id, { is_archived: true })
			.then(() => {
				addToast('Task archieved succesfully', { appearance: 'success', autoDismiss: true });
				fetchMyDailyTask();
			})
			.catch(err => {
				addToast('Something went wrong', { appearance: 'error', autoDismiss: true });
			});
	}

	useEffect(fetchMyDailyTask, [date]);
	return (
		<>
			{daily_tasks && daily_tasks.length > 0 ? (
				daily_tasks.map((item, index) => (
					<CustomSingleTask
						key={index}
						item={item.task}
						taskId={item._id}
						index={index}
						assigned={true}
						status={item.status}
						statusChanging={statusChanging && statusChanging.id === item._id && statusChanging.isChanging}
						changeTaskStatus={changeTaskStatus}
						removeFromDailyTask={removeFromMyTask}
						archeiveTasks={archeiveTask}
					/>
				))
			) : (
				<div> No Task Added!!</div>
			)}
		</>
	);
}

export default MyDailyTasks;
