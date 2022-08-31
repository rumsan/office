import React, { useState, useContext } from 'react';
import { Row, Col, Input, Label, FormGroup, InputGroup } from 'reactstrap';
import CustomModal from '../../global/CustomModal';
import { ProjectSelector } from '../../projects';
import CustomWeekPicker from '../../global/CustomWeekPicker';
import styled from 'styled-components';
import moment from 'moment';
import { useToasts } from 'react-toast-notifications';
import { ChargeHoursContext } from '../../../contexts/ChargeHoursContext';

const defaultFormData = {
	date: moment(new Date()).format('YYYY-MM-DD')
};

function AddChargeHours(props) {
	const { addToast } = useToasts();
	const { title, open, setOpen, assignTo, size = 'lg', reFetch } = props;
	const { assignChargeHoursByManager } = useContext(ChargeHoursContext);
	const [hours, setHours] = useState(0);
	const [mins, setMins] = useState(0);
	const [selectedProject, setSelectedProject] = useState('');
	const [formData, setFormData] = useState(defaultFormData);
	const [weekRange, setWeekRange] = useState({});

	const resetDefault = () => {
		setHours(0);
		setMins(0);
		setFormData(defaultFormData);
		setSelectedProject('');
		setOpen(false);
		reFetch();
	};

	const handleFormDataChange = (field, value) => {
		let newFormData = { ...formData };
		newFormData[`${field}`] = value;
		setFormData(newFormData);
	};

	const handleSubmit = e => {
		e.preventDefault();
		if (!selectedProject || !weekRange || (hours === 0 && mins === 0)) {
			addToast('Project, Week & Hours is Required', { appearance: 'error', autoDismiss: true });
			return;
		}
		const formatedHours = Number(hours) + Number(mins) / 60;
		const payload = {
			project: selectedProject.id,
			details: formData.details,
			date: weekRange.endDate,
			hours: formatedHours
		};
		payload.created_by = assignTo;
		assignChargeHoursByManager(payload)
			.then(() => {
				resetDefault();
				addToast('Charge Sheet Added Successfully', { appearance: 'success', autoDismiss: true });
			})
			.catch(err => addToast(err.message, { appearance: 'error', autoDismiss: true }));
	};

	return (
		<>
			<CustomModal
				title={title || 'Add Charge Hours'}
				open={open}
				setOpen={setOpen}
				size={size}
				handleSubmit={handleSubmit}
				handleCancel={resetDefault}
			>
				<Row>
					<Col md={4}>
						<ItemDiv className="form-item">
							<label>Week: </label>
							<br />
							<CustomWeekPicker date={formData.date} weekRange={weekRange} setWeekRange={e => setWeekRange(e)} />
						</ItemDiv>
					</Col>
					<Col md="4">
						<ItemDiv className="form-item">
							<ProjectSelector project={selectedProject} user={assignTo} onChange={e => setSelectedProject(e)} />
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
										onChange={e => setHours(e.target.value)}
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

export default AddChargeHours;
