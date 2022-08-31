import React, { useState, useEffect, useContext } from 'react';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { ProjectSelector } from '../../projects';
import { Row, Col, Button, Card, CardTitle, CardBody, Input, Label, FormGroup, InputGroup } from 'reactstrap';
import { ChargeHoursContext } from '../../../contexts/ChargeHoursContext';
import { useToasts } from 'react-toast-notifications';
import CustomModal from '../../global/CustomModal';
import moment from 'moment';
import styled from 'styled-components';
import MyChargeList from './myChargeList';
import Swal from 'sweetalert2';
import CustomWeekPicker from '../../global/CustomWeekPicker';

const defaultFormData = {
	date: moment(new Date()).format('YYYY-MM-DD')
};

function MyDailyCharge({ props }) {
	const { user, taskDate } = props;
	const { addToast } = useToasts();
	const { list, addChargeSheet, listChargeSheet, deleteChargeSheet, updateChargeSheet } = useContext(
		ChargeHoursContext
	);

	const [open, setOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);

	const [formData, setFormData] = useState(defaultFormData);
	const [hours, setHour] = useState(0);
	const [mins, setMins] = useState(0);
	const [selectedProject, setSelectedProject] = useState('');
	const [selectedCharge, setSelectedCharge] = useState('');

	const [weekRange, setWeekRange] = useState({});
	const [weekRangeModal, setWeekRangeModal] = useState({});

	function handleModalClose() {
		setHour(0);
		setMins(0);
		setFormData(defaultFormData);
		setSelectedProject('');
	}

	const toggle = () => setOpen(!open);

	const handleAdd = payload => {
		addChargeSheet(payload)
			.then(() => {
				toggle();
				fetchChargeSheets(weekRange);
				handleModalClose();
				addToast('Charge Sheet Added Successfully', { appearance: 'success', autoDismiss: true });
			})
			.catch(err => addToast(err.message, { appearance: 'error', autoDismiss: true }));
	};

	const handleUpdate = payload => {
		updateChargeSheet(selectedCharge, payload)
			.then(() => {
				toggle();
				fetchChargeSheets(weekRange);
				handleModalClose();
				addToast('Charge Sheet Updated Successfully', { appearance: 'success', autoDismiss: true });
			})
			.catch(err => addToast(err.message, { appearance: 'error', autoDismiss: true }));
	};

	function submitForm(e) {
		e.preventDefault();
		if (!selectedProject || !weekRangeModal || (hours === 0 && mins === 0)) {
			addToast('Project, Week & Hours is Required', { appearance: 'error', autoDismiss: true });
			return;
		}
		const formatedHours = Number(hours) + Number(mins) / 60;
		const payload = {
			project: selectedProject.id,
			details: formData.details,
			date: weekRangeModal.endDate,
			hours: formatedHours
		};
		if (editOpen) {
			handleUpdate(payload);
			return;
		}
		payload.created_by = user;
		handleAdd(payload);
	}

	const handleFormDataChange = (field, value) => {
		let newFormData = { ...formData };
		newFormData[`${field}`] = value;
		setFormData(newFormData);
	};

	const fetchChargeSheets = async range => {
		const { startDate, endDate } = range;
		if (!startDate || !endDate) return;
		listChargeSheet({ startDate, endDate, user })
			.then(d => {})
			.catch(err => {
				addToast('Something went wrong', { appearance: 'error', autoDismiss: true });
			});
	};

	const handleDelete = async id => {
		Swal.fire({
			title: 'Are you sure?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes'
		}).then(result => {
			if (result.isConfirmed) {
				deleteChargeSheet(id)
					.then(d => fetchChargeSheets(weekRange))
					.catch(err => {
						addToast(err.message, { appearance: 'error', autoDismiss: true });
					});
			}
		});
	};

	const handleEdit = async item => {
		const { _id, details, date, hours, project } = item;
		let [hr, mins] = String(hours).split('.');
		if (!mins) mins = 0;
		if (mins) {
			mins = Number(`.${mins}`) * 60;
		}
		setHour(Number(hr));
		setMins(mins);
		setSelectedProject({ id: project._id, name: project.name });
		setFormData({ details, date });
		setEditOpen(true);
		setSelectedCharge(_id);
		setOpen(true);
	};

	useEffect(() => {
		async function fetch() {
			fetchChargeSheets(weekRange);
		}
		fetch();
	}, [weekRange]);

	return (
		<>
			<Card>
				<CardTitle className="mb-0 p-3 border-bottom bg-light">
					<Row>
						<Col md="6">
							<i className="mdi mdi-border-right mr-2"></i>My Charge Hours
						</Col>
						<Col md="6">
							<CustomWeekPicker date={taskDate} weekRange={weekRange} setWeekRange={e => setWeekRange(e)} />
						</Col>
					</Row>
				</CardTitle>
				<CardBody>
					<MyChargeList list={list} handleDelete={handleDelete} handleEdit={handleEdit} />
					<br />
					<Row>
						<Col xs={6} className="text-left">
							Total Hours:{' '}
							{list
								?.filter(d => d.created_by === user)
								.map(c => c.hours)
								.reduce((a, b) => a + b, 0)}
							/40 hrs
						</Col>
						<Col xs={6} className="text-right ">
							<Button
								className="first-step align-item-center"
								color="primary"
								onClick={() => {
									toggle();
									setEditOpen(false);
								}}
								size="sm"
							>
								<i className="fas fa-plus"></i> &nbsp;Add Charge Hours
							</Button>
						</Col>
					</Row>
				</CardBody>
			</Card>
			<CustomModal
				title={editOpen ? `Update Charge Hours` : `Add Charge Hours `}
				open={open}
				setOpen={toggle}
				size="lg"
				handleSubmit={submitForm}
				handleCancel={handleModalClose}
			>
				<Row>
					<Col md={4}>
						<ItemDiv className="form-item">
							<label>Week: </label>
							<br />
							<CustomWeekPicker
								date={formData.date}
								weekRange={weekRangeModal}
								setWeekRange={e => setWeekRangeModal(e)}
							/>
						</ItemDiv>
					</Col>
					<Col md="4">
						<ItemDiv className="form-item">
							<ProjectSelector project={selectedProject} user={user} onChange={e => setSelectedProject(e)} />
						</ItemDiv>
					</Col>
					<Col md={4}>
						<ItemDiv className="form-item">
							<label>Hours: </label>
							<br />
							<FormGroup className="d-flex w-25 justify-content-between ">
								<InputGroup className="mr-3">
									<Input
										type="select"
										value={hours}
										style={{ width: 'fit-content' }}
										onChange={e => setHour(e.target.value)}
									>
										{[...Array(41).keys()].map((item, index) => (
											<option value={item} key={index}>
												{item}
											</option>
										))}
									</Input>
									<Label>hrs</Label>
								</InputGroup>

								<InputGroup className="mr-3">
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
									<Label>mins</Label>
								</InputGroup>
							</FormGroup>
						</ItemDiv>
					</Col>
				</Row>
				<Row>
					<Col md="12">
						<ItemDiv className="form-item">
							<label>Details: </label>
							<br />
							<Input
								type="input"
								value={formData?.details}
								required
								onChange={e => handleFormDataChange('details', e.target.value)}
							></Input>
						</ItemDiv>
					</Col>
				</Row>
			</CustomModal>
		</>
	);
}

const ItemDiv = styled.div`
	width: 'max-width';
	margin: '10px';
	margin-bottom: '10px';
`;

export default MyDailyCharge;
