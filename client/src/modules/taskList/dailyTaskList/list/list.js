import React, { useState, useEffect, useContext } from 'react';
import RenderTask from '../RenderTask';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
	ButtonDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	Row,
	Col,
	Button,
	Input,
	Label,
	FormGroup,
	InputGroup
} from 'reactstrap';
import TaskMapper from '../../taskMapper';
import * as TASKMANAGER from '../../../../constants/taskSource';
import * as SessionManager from '../../../../utils/sessionManager';
import { DailyTaskContext } from '../../../../contexts/DailyTaskContext';
import { useToasts } from 'react-toast-notifications';
import DatePicker from '../../../global/DatePicker';
import CustomModal from '../../../global/CustomModal';

function List({ props }) {
	const { addToast } = useToasts();
	const { tasks, members, reFetch, date, setDate } = props;
	const { addDailyTask } = useContext(DailyTaskContext);

	const { _id } = SessionManager.getUser();
	const [dropdownOpen, setOpen] = useState([]);
	const [open, setModalOpen] = useState(false);
	const [assigned_to, setAssignedTo] = useState(null);

	const toggle = indx => setOpen(prev => prev.map((item, index) => (index === indx ? !item : item)));

	const [formError, setFormError] = useState(null);
	const [formData, setFormData] = useState({});
	const [task, setTask] = useState({});
	const [taskManager, setTaskManager] = useState(null);
	const [hours, setHour] = useState(0);
	const [mins, setMins] = useState(0);

	function handleModalClose() {
		setTaskManager(null);
		setHour(0);
		setMins(0);
		setTask({});
		setFormData({});
	}

	function setCurrentTaskManager(manager) {
		setTaskManager(manager);
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
		const estimated_time = parseInt(hours * 60 + mins);
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
				setModalOpen(!open);
				reFetch();
				handleModalClose();
				addToast('Task assigned successfully', { appearance: 'success', autoDismiss: true });
			})
			.catch(err => addToast('Something went wrong', { appearance: 'error', autoDismiss: true }));
	}

	useEffect(() => {
		if (!members || !members.length) return;
		setOpen(members.map(itm => false));
	}, [members]);

	return (
		<>
			{members && members.length
				? members.map((member, index) => (
						<Row key={index} className=" pt-2 pb-2 border-bottom">
							<Col md="2">
								<ButtonDropdown isOpen={dropdownOpen[index]} toggle={() => toggle(index)}>
									<DropdownToggle
										style={{
											width: '100px',
											overflow: 'hidden',
											backgroundColor: 'rgb(26, 179, 147)',
											border: 'none',
											padding: '0.2rem'
										}}
										size="sm"
										caret
									>
										{member.name}
									</DropdownToggle>
									<DropdownMenu>
										<DropdownItem
											onClick={() => {
												setAssignedTo(member._id);
												setModalOpen(!open);
											}}
										>
											Assign Task
										</DropdownItem>
									</DropdownMenu>
								</ButtonDropdown>
							</Col>

							<Col md="10">
								{tasks && tasks.length && tasks.filter(d => d.user === member._id).length ? (
									<PerfectScrollbar>
										<div style={{ maxHeight: '250px' }}>
											<RenderTask tasks={tasks.filter(d => d.user === member._id)} reFetch={reFetch} date={date} />
										</div>
									</PerfectScrollbar>
								) : (
									<Button
										size="sm"
										style={{ float: 'right' }}
										color="primary"
										onClick={() => {
											setAssignedTo(member._id);
											setModalOpen(!open);
										}}
									>
										<i className="fas fa-plus"></i> &nbsp;Assign Task
									</Button>
								)}
							</Col>
						</Row>
				  ))
				: ''}
			<CustomModal
				title="Assign Task"
				open={open}
				setOpen={setModalOpen}
				size="lg"
				handleSubmit={submitForm}
				handleCancel={handleModalClose}
			>
				{formError ? <p style={{ color: 'red' }}>***{formError}***</p> : ''}
				<Row>
					<Col md="6">
						<Label>Select a Task Manager</Label>
						<br />
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
					</Col>
					<Col md="6">
						<Label>Select Date:</Label>
						<DatePicker date={date} setDate={setDate} />
					</Col>
				</Row>
				<br />
				{taskManager && assigned_to ? (
					<TaskMapper
						source={taskManager && taskManager}
						task={task}
						setTask={setTask}
						assigned_by={_id}
						assigned_to={assigned_to}
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
}

export default List;
