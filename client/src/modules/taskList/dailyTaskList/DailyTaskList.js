import React, { useState, useEffect, useContext } from 'react';

import { Card, CardBody, CardTitle, Row, Col, Input, Button, InputGroup, InputGroupAddon } from 'reactstrap';
import DatePicker from '../../global/DatePicker';
import List from './list';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { DailyTaskContext } from '../../../contexts/DailyTaskContext';
import { useToasts } from 'react-toast-notifications';
import moment from 'moment';
import { getAllEntities } from '../../projects/customer.services';
import { getUserTeamName } from '../../../utils/sessionManager';

function DailyTaskList() {
	const defaultTeam = getUserTeamName();
	const [date, setDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
	const [teamMembers, setTeamMembers] = useState([]);
	const [allTasks, setAllTasks] = useState([]);
	const [selectedMember, setSelectedMember] = useState('all');
	const [selectedTeam, setSelectedTeam] = useState(defaultTeam);
	const [filteredTeamMembers, setFilteredTeamMembers] = useState([]);
	const { addToast } = useToasts();
	const { getAllDailyTask } = useContext(DailyTaskContext);
	const [entities, setEntities] = useState([]);

	function fetchTasksAndUsers() {
		getAllDailyTask(date)
			.then(d => {
				setTeamMembers(d.users);
				setAllTasks(d.daily_tasks);
			})
			.catch(err => {
				addToast('Something went wrong', { appearance: 'error', autoDismiss: true });
			});
	}

	function handleTeamChange(team) {
		setSelectedMember('all');
		setSelectedTeam(team);
	}

	function handleMemberChange(member) {
		setSelectedTeam('all');
		setSelectedMember(member);
	}

	const resetFilter = () => {
		setSelectedMember('all');
		setSelectedTeam('all');
	};

	function filterTeamMembers() {
		if (!entities.length || !selectedTeam || !teamMembers || !selectedMember) return;
		if (selectedTeam === 'all' && selectedMember === 'all') {
			setFilteredTeamMembers(teamMembers);
			return;
		}
		if (selectedMember !== 'all') {
			const filteredMembers = teamMembers.filter(d => d._id === selectedMember);
			setFilteredTeamMembers(filteredMembers);
			return;
		}
		if (selectedTeam !== 'all') {
			const filteredTeamMembers = teamMembers.filter(d => d.team === selectedTeam);
			setFilteredTeamMembers(filteredTeamMembers);
		}
	}

	useEffect(fetchTasksAndUsers, [date]);
	useEffect(() => {
		async function fetchEntites() {
			const res = await getAllEntities();
			let formattedEntitiesList = res && res.data.length > 0 ? res.data : [];
			formattedEntitiesList = formattedEntitiesList.filter(
				entity => entity.type === 'business' && entity.is_archived === false
			);
			formattedEntitiesList = formattedEntitiesList.map(data => {
				return { label: data.name, value: data._id };
			});
			setEntities(formattedEntitiesList);
		}
		fetchEntites();
	}, []);
	useEffect(filterTeamMembers, [entities, teamMembers, selectedTeam, selectedMember]);

	return (
		<>
			<Row>
				<Col md="10">
					<Card>
						<CardTitle className="mb-0 p-3 border-bottom bg-light">
							<Row>
								<Col md="4">
									<i className="mdi mdi-border-right mr-2"></i> Daily Task List
								</Col>
							</Row>
						</CardTitle>
						<CardTitle className="mb-0 p-3 border-bottom ">
							<Row>
								<Col md="3">
									<DatePicker date={date && date} setDate={setDate} />
								</Col>
								<Col md="6" className="ml-auto">
									<Row>
										<Col md="6">
											<Input
												type="select"
												name="team"
												value={selectedTeam}
												className="form-field"
												onChange={e => handleTeamChange(e.target.value)}
											>
												<option key="all" value="all">
													All
												</option>
												{entities?.map((item, index) => (
													<option key={index} value={item.label}>
														{item.label}
													</option>
												))}
											</Input>
										</Col>
										<Col md="6">
											<InputGroup>
												<Input
													type="select"
													name="employee"
													value={selectedMember}
													className="form-field"
													onChange={e => handleMemberChange(e.target.value)}
												>
													<option key="all" value="all">
														All People
													</option>
													{teamMembers?.map((item, index) => (
														<option value={item._id} key={index}>
															{item.name}
														</option>
													))}
												</Input>
												<InputGroupAddon addonType="append">
													<Button color="danger" onClick={resetFilter} className="btn" title="Reset Filters">
														<i className="fa fa-ban"></i>
													</Button>
												</InputGroupAddon>
											</InputGroup>
										</Col>
									</Row>
								</Col>
							</Row>
						</CardTitle>

						<CardBody>
							<List
								members={filteredTeamMembers}
								tasks={allTasks}
								reFetch={fetchTasksAndUsers}
								date={date}
								setDate={setDate}
							/>
						</CardBody>
					</Card>
				</Col>
			</Row>
		</>
	);
}

export default DailyTaskList;
