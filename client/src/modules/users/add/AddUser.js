import React, { useState, useEffect } from 'react';
import { Button, Input, Label, FormGroup, InputGroup } from 'reactstrap';
import generatePassword from '../../../utils/generatePassword';
import DatePicker from '../../global/DatePicker';
import ReactSelect from '../../global/ReactSelect';
import { listRoles } from '../../../services/roles';
import RUMSAN_TEAM from '../../../constants/rumsanTeams';
function AddUser({ props }) {
	const [date, setDate] = useState(new Date());
	const [roles, setRoles] = useState([]);
	const { formData, setForm, errors } = props;
	const gender = [
		{ value: 'M', label: 'Male' },
		{ value: 'F', label: 'Female' },
		{ value: 'O', label: 'Others' },
		{ value: 'U', label: 'Unknown' }
	];
	const isEmployee = [
		{
			value: true,
			label: 'True'
		},
		{
			value: false,
			label: 'False'
		}
	];
	function changeIsEmployee(arg) {
		const e = { target: { name: 'is_employee', value: arg.value } };
		changeFormData(e);
	}

	function changeTeam(arg) {
		const e = { target: { name: 'team', value: arg.value } };
		changeFormData(e);
	}
	function changeGender(arg) {
		const e = { target: { name: 'gender', value: arg.value } };
		changeFormData(e);
	}
	function changeRoles(arg) {
		const e = { target: { name: 'roles', value: arg.value } };
		setForm({
			...formData,
			roles: [e.target.value]
		});
	}

	function changeFormData(e) {
		setForm({ ...formData, [e.target.name]: e.target.value });
	}
	function passwordGenerate() {
		const genPassword = generatePassword();

		setForm(prev => {
			return {
				...prev,
				password: genPassword
			};
		});
	}
	function fetchRoles(query = {}) {
		listRoles(query)
			.then(d => {
				const respRoles = d.data.map(item => {
					return { value: item.name, label: item.name };
				});
				setRoles(respRoles);
			})
			.catch(err => {
				setRoles([]);
			});
	}
	function setFormDate() {
		if (!date) return;
		setForm({
			...formData,
			dob: date
		});
	}
	useEffect(setFormDate, [date]);
	useEffect(fetchRoles, []);
	return (
		<>
			<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
				<FormGroup style={{ width: '48%', minWidth: '5rem' }}>
					<Label>Name :</Label>
					<Input
						type="text"
						name="name"
						onChange={changeFormData}
						value={formData && formData.name ? formData.name : ''}
						required
					/>
				</FormGroup>
				<FormGroup style={{ width: '48%', minWidth: '5rem' }}>
					<Label>Password :</Label>
					<InputGroup>
						<Input
							type="text"
							name="password"
							value={formData && formData.password ? formData.password : ''}
							onChange={changeFormData}
							required
						/>
						<Button onClick={passwordGenerate}>
							<i className="far fa-keyboard"></i>
						</Button>
					</InputGroup>
				</FormGroup>
			</div>
			<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
				<FormGroup style={{ width: '48%', minWidth: '5rem' }}>
					<Label>Email :</Label>
					<Input
						name="email"
						type="email"
						onChange={changeFormData}
						value={formData && formData.email ? formData.email : ''}
						required
					/>
				</FormGroup>
				<FormGroup style={{ width: '48%', minWidth: '5rem' }}>
					<Label>Phone :</Label>
					<Input
						name="phone"
						type="number"
						value={formData && formData.phone ? formData.phone : ''}
						onChange={changeFormData}
						required
					/>
				</FormGroup>
			</div>
			<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
				<FormGroup style={{ width: '48%', minWidth: '5rem' }}>
					<Label>Gender :</Label>
					<ReactSelect options={gender} onSelect={changeGender} required="true" />
				</FormGroup>
				<FormGroup style={{ width: '48%', minWidth: '5rem' }}>
					<Label>Date of Birth :</Label>
					<DatePicker date={date ? date : ''} setDate={setDate} />
				</FormGroup>
			</div>
			<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
				<FormGroup style={{ width: '30%', minWidth: '5rem' }}>
					<Label>isEmployee ? :</Label>
					<ReactSelect options={isEmployee} onSelect={changeIsEmployee} required="true" />
				</FormGroup>
				<FormGroup style={{ width: '30%', minWidth: '5rem' }}>
					<Label>Team:</Label>

					<ReactSelect options={RUMSAN_TEAM.slice(1)} onSelect={changeTeam} />
				</FormGroup>
				<FormGroup style={{ width: '30%', minWidth: '5rem' }}>
					<Label>Role:</Label>
					<ReactSelect options={roles} onSelect={changeRoles} required="true" />
				</FormGroup>

				<p style={{ color: 'red' }}>{errors ? `*** ${errors} ***` : ''}</p>
			</div>
		</>
	);
}

export default AddUser;
