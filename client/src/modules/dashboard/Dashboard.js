import React, { useState, useContext, useEffect } from 'react';
import { Card, CardBody, CardTitle, Row, Col, Input, Button, Label, FormGroup, InputGroup } from 'reactstrap';
import CustomModal from '../global/CustomModal';
import OutStandingTasks from '../taskList/outStandingTasks/list';
import List from '../taskList/myDailyTasks';
import MyDailyChargeList from '../chargeHours/myDailyCharge';
import DatePicker from '../global/DatePicker';
import { useToasts } from 'react-toast-notifications';
import * as TASKMANAGER from '../../constants/taskSource';
import TaskMapper from '../taskList/taskMapper';
import * as SessionManager from '../../utils/sessionManager';
import { TaskContext } from '../../contexts/TaskContext';
import { DailyTaskContext } from '../../contexts/DailyTaskContext';

import moment from 'moment';
import { UserContext } from '../../contexts/UserContext';
import { Link } from 'react-router-dom';
import Tour from 'reactour';
const Dashboard = () => {
	const { addToast } = useToasts();
	const { _id, is_new } = SessionManager.getUser();
	const { getAppKeys, updateMyDetails } = useContext(UserContext);
	const { getMyDailyTasks, addDailyTask } = useContext(DailyTaskContext);
	const { getDailyTasks } = useContext(TaskContext);

	const step1 = [
		{
			selector: '.first-step',
			content: ({ goTo, inDOM }) => (
				<div style={{ padding: '1rem 0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
					Add task to your daily tasks.
					<Button
						size="sm"
						color="danger"
						onClick={() => endTour()}
						style={{ width: 'fit-content', margin: '0.5rem 0' }}
					>
						End tour
					</Button>
				</div>
			),
			style: {
				borderRadius: '10px'
			}
		}
	];

	const noKeyStep = [
		{
			selector: '.second-step',
			content: ({ goTo, inDOM }) => (
				<div style={{ margin: '0.5rem' }}>
					<p>
						Oops ! Application <strong> API keys </strong> are not setted up.
					</p>
					<Link to="/profile">
						<Button size="sm"> Go to profile</Button>
					</Link>
					<Button
						size="sm"
						color="danger"
						onClick={() => endTour()}
						style={{ width: 'fit-content', marginLeft: '0.5rem ' }}
					>
						End tour
					</Button>
				</div>
			),
			style: {
				borderRadius: '10px'
			}
		}
	];
	const secondStep = [
		{
			selector: '.second-step',
			content: ({ goTo, inDOM }) => (
				<div style={{ padding: '1rem 0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
					Choose task Manager.
					<Button
						size="sm"
						color="danger"
						onClick={() => endTour()}
						style={{ width: 'fit-content', margin: '0.5rem 0' }}
					>
						End tour
					</Button>
				</div>
			),
			style: {
				borderRadius: '10px'
			}
		}
	];

	const [isTourOpen, setIsTourOpen] = useState(false);
	const [isSecondStepOpen, setIsSecondStepOpen] = useState(false);

	const [date, setDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
	const [open, setModalOpen] = useState(false);
	const [formError, setFormError] = useState(null);
	const [formData, setFormData] = useState({});
	const [task, setTask] = useState({});
	const [taskManager, setTaskManager] = useState(null);
	const [hours, setHour] = useState(0);
	const [mins, setMins] = useState(0);
	const [keys, setKeys] = useState(null);
	function handleModalClose() {
		setTaskManager(null);
		setHour(0);
		setMins(0);
		setTask({});
		setFormData({});
	}

	function toggle() {
		setModalOpen(!open);
		setTimeout(() => {
			setIsSecondStepOpen(!isSecondStepOpen);
		}, 700);
	}

	function setCurrentTaskManager(manager) {
		setTaskManager(manager);
		setIsSecondStepOpen(false);
	}

	function submitForm(e) {
		e.preventDefault();
		if (!date || Object.keys(task).length < 1) {
			setFormError('All fields are required...');
			setTimeout(() => {
				setFormError(null);
			}, 2000);

			return;
		}
		const estimated_time = parseInt(hours * 60) + parseInt(mins);
		if (estimated_time < 10) {
			setFormError('Time should not be less than 10 minutes');
			setTimeout(() => {
				setFormError(null);
			}, 800);
			return;
		}

		formData.date = date;
		formData.task = task;
		formData.status = 'incomplete';
		formData.task.est_time = estimated_time;

		addDailyTask(formData)
			.then(() => {
				getMyDailyTasks();
				getDailyTasks();
				toggle();
				handleModalClose();
				addToast('Task assigned successfully', { appearance: 'success', autoDismiss: true });
			})
			.catch(err => addToast('Something went wrong', { appearance: 'error', autoDismiss: true }));
	}
	const fetchUserData = () => {
		getAppKeys()
			.then(res => {
				setIsTourOpen(true);
				setKeys({ ...res });
			})
			.catch(e => {
				setIsTourOpen(false);
				addToast('Something went wrong', { appearance: 'error', autoDismiss: true });
			});
	};
	function endTour() {
		setIsTourOpen(false);
		setIsSecondStepOpen(false);
		updateMyDetails({ is_new: false })
			.then()
			.catch(err => {
				addToast('Something went wrong', { appearance: 'error', autoDismiss: true });
			});
	}
	useEffect(fetchUserData, []);
	return (
		<>
			<Tour
				steps={step1}
				isOpen={is_new && isTourOpen}
				onRequestClose={() => setIsTourOpen(false)}
				showButtons={false}
				showNumber={false}
				showNavigationNumber={false}
				showNavigation={false}
			/>
			<Tour
				steps={keys && Object.keys(keys).length ? secondStep : noKeyStep}
				isOpen={is_new && isSecondStepOpen}
				onRequestClose={() => setIsSecondStepOpen(false)}
				showButtons={false}
				showNumber={false}
				showNavigationNumber={false}
				showNavigation={false}
			/>

			<Row>
				<Col md="7">
					<Card>
						<CardTitle className="mb-0 p-3 border-bottom bg-light">
							<Row>
								<Col md="4">
									<i className="mdi mdi-border-right mr-2"></i>My Daily Tasks
								</Col>

								<Col md="6" className="ml-auto mr-4">
									<DatePicker date={date} setDate={setDate} />
								</Col>
							</Row>
						</CardTitle>
						<CardBody>
							<List date={date} setDate={setDate} />
							<br />
							<Row>
								<Col className="text-center ">
									<Button
										className="first-step align-item-center"
										color="primary"
										onClick={() => {
											toggle();
											setIsTourOpen(false);
										}}
										size="sm"
									>
										<i className="fas fa-plus"></i> &nbsp;Add Task for this day
									</Button>
								</Col>
							</Row>
						</CardBody>
					</Card>
					<MyDailyChargeList user={_id} taskDate={date} />
				</Col>
				<Col md="5">
					<Card>
						<CardTitle className="mb-0 p-3 border-bottom bg-light">
							<Row>
								<Col>Other Outstanding Tasks</Col>
							</Row>
						</CardTitle>
						<CardBody>
							<OutStandingTasks date={date} />
						</CardBody>
					</Card>
				</Col>
			</Row>
			<CustomModal
				title="Add Daily Task"
				open={open}
				setOpen={setModalOpen}
				size="lg"
				handleSubmit={submitForm}
				handleCancel={handleModalClose}
			>
				{formError ? <p style={{ color: 'red' }}>***{formError}***</p> : ''}
				<Row>
					{keys && Object.keys(keys).length ? (
						<Col md="6">
							<Label>Select a Task Manager</Label>
							<br />

							<div className="second-step" style={{ width: 'max-content' }}>
								{keys && keys.meistertask && (
									<Button
										color="primary"
										className="mr-3"
										active={taskManager && taskManager === TASKMANAGER.MEISTERTASK}
										onClick={() => {
											setCurrentTaskManager(TASKMANAGER.MEISTERTASK);
										}}
									>
										MiesterTask
									</Button>
								)}

								{keys && keys.gitlab && (
									<Button
										color="warning"
										className="text-white"
										active={taskManager && taskManager === TASKMANAGER.GITLAB}
										onClick={() => {
											setCurrentTaskManager(TASKMANAGER.GITLAB);
										}}
									>
										GitLab
									</Button>
								)}
							</div>
						</Col>
					) : (
						<Col md="6">
							<p className="second-step">
								Set up application <strong> API keys </strong> first. <a href="/profile">Link</a>{' '}
							</p>
						</Col>
					)}
					<Col md="6">
						<Label>Select Date:</Label>
						<DatePicker date={date} setDate={setDate} />
					</Col>
				</Row>
				<br />
				{taskManager ? (
					<TaskMapper
						source={taskManager && taskManager}
						task={task}
						setTask={setTask}
						assigned_by={_id}
						assigned_to={_id}
					/>
				) : (
					<div className="alert alert-warning">
						<i>
							<em>Please select task manager first</em>
						</i>
					</div>
				)}
				<br />
				<>
					<Label>Estimated Time:</Label>
					<br />
					<FormGroup className="d-flex w-25 justify-content-between ">
						<InputGroup className="mr-3 d-flex flex-column">
							<Label>hrs :</Label>
							<Input
								type="select"
								value={hours}
								style={{ width: 'fit-content' }}
								onChange={e => setHour(e.target.value)}
							>
								{[...Array(13).keys()].map((item, index) => (
									<option value={item} key={index}>
										{item}
									</option>
								))}
							</Input>
						</InputGroup>

						<InputGroup className="mr-3 d-flex flex-column">
							<Label>mins :</Label>

							<Input
								type="select"
								style={{ width: 'fit-content' }}
								value={mins}
								onChange={e => setMins(e.target.value)}
							>
								{[...Array(60).keys()]
									.filter(value => value % 15 === 0)
									.map((item, index) => (
										<option value={item} key={index}>
											{item}
										</option>
									))}
							</Input>
						</InputGroup>
					</FormGroup>
				</>
			</CustomModal>
		</>
	);
};

export default Dashboard;
