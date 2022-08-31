import React, { useContext, useState } from 'react';
import { Button } from 'reactstrap';
import styled from 'styled-components';
import { DailyTaskContext } from '../../../../contexts/DailyTaskContext';
import { useToasts } from 'react-toast-notifications';
import LoadingSpinner from '../../../global/Spinner';

function RenderTask({ props }) {
	const { tasks, reFetch } = props;

	const { addToast } = useToasts();
	const [statusChanging, setStatusChanging] = useState(null);

	const { changeDailyTaskStatus, removeFromDailyTask } = useContext(DailyTaskContext);
	function removeFromMyTask(id) {
		removeFromDailyTask(id)
			.then(() => {
				addToast('Task removed successfully', { appearance: 'success', autoDismiss: true });
				reFetch();
			})
			.catch(err => {
				addToast('Something went wrong', { appearance: 'error', autoDismiss: true });
			});
	}
	function changeTaskStatus(taskId, status) {
		setStatusChanging({ id: taskId, isChanging: true });
		changeDailyTaskStatus(taskId, status)
			.then(() => {
				addToast('Task Status changed', { appearance: 'success', autoDismiss: true });
				setStatusChanging({ id: taskId, isChanging: false });
				reFetch();
			})
			.catch(e => {
				addToast('Something went wrong', { appearance: 'error', autoDismiss: true });
				setStatusChanging({ id: taskId, isChanging: false });
			});
	}
	return (
		<>
			{tasks && tasks.length
				? tasks.map((item, index) => (
						<TaskDiv background={index && index % 2 === 0 ? 'dark' : index === 0 ? 'dark' : 'light'} key={index}>
							<TaskOverView>
								<TaskTitle>{item.task.name}</TaskTitle>
								<TaskDetails>
									<p style={{ width: 'max-content', display: 'inline-flex' }}>
										<strong>Est. time :</strong> {Math.floor(item.task.est_time / 60) + ':' + (item.task.est_time % 60)}{' '}
										| <strong>{`${item.task.source} >`}</strong> {item.task.sourceData.projectPath}
									</p>
								</TaskDetails>
							</TaskOverView>
							<ButtonGroup>
								{statusChanging && statusChanging.id === item._id && statusChanging.isChanging ? (
									<LoadingSpinner numberOfSpinners={1} />
								) : item.status === 'complete' ? (
									<Button
										size="sm"
										color="success"
										style={{ marginRight: '0.2rem' }}
										onClick={() => {
											changeTaskStatus(item._id, 'incomplete');
										}}
									>
										Completed
									</Button>
								) : (
									<Button
										size="sm"
										color="warning"
										style={{ marginRight: '0.2rem' }}
										onClick={() => changeTaskStatus(item._id, 'complete')}
									>
										Incomplete
									</Button>
								)}
								<Button
									size="sm"
									color="danger"
									style={{ marginRight: '0.2rem' }}
									onClick={() => removeFromMyTask(item._id)}
								>
									<i className="fas fa-trash"></i>
								</Button>
								<Button size="sm" color="info" title="View Details">
									<a
										target="_blank"
										href={item.task.sourceData.url}
										rel="noopener noreferrer"
										style={{ textDecoration: 'none', color: 'white' }}
									>
										{' '}
										<i className=" fas fa-unlink"></i>
									</a>
								</Button>
							</ButtonGroup>
						</TaskDiv>
				  ))
				: ''}
		</>
	);
}

const TaskDiv = styled.div`
	padding: 0.4rem;
	display: flex;
	justify-content: space-between;
	background: ${props => (props.background === 'light' ? 'white' : 'rgb(242, 242, 242)')};
	box-sizing: border-box;
	margin-bottom: 0.3rem;
`;
const TaskOverView = styled.div`
	height: 100%;
	padding: 0;
`;
const TaskDetails = styled.div`
	display: flex;
	height: max-content;
	font-size: 0.6rem;
	font-weight: 600;
	padding: 0;
`;

const TaskTitle = styled.p`
	font-weight: 500;
	font-size: 0.9rem;
	padding: 0;
	margin: 0;
`;
const ButtonGroup = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

export default RenderTask;
