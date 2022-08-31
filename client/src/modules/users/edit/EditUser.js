import React, { useState, useEffect, useContext } from 'react';
import { Button, Card, CardBody, CardTitle, Col, Input, Row, Table, CardHeader, FormGroup, Label } from 'reactstrap';
import { UserContext } from '../../../contexts/UserContext';
import { useHistory } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';

import ReactSelect from '../../global/ReactSelect';
import { RoleContext } from '../../../contexts/RoleContext';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { StyledDivFlex2, StyledFormGroupW50 } from '../../../assets/scss/styledCOmponent/StyledComponent';
import moment from 'moment';
import { EntitySelector } from '../../projects';

function EditUser(props) {
	const history = useHistory();
	const { addToast } = useToasts();
	const {
		listUsers,
		getUserInfo,
		updateUserDetails,
		assignRoleToUser,
		removeRoleFromUser,
		deleteExEmployee
	} = useContext(UserContext);

	const { listRole } = useContext(RoleContext);

	const [filteredRoles, setFilteredRoles] = useState([]);
	const { id } = props;
	const [user, setUser] = useState(null);
	const [dob, setDate] = useState(null);
	const [roles, setRoles] = useState([]);
	const [payload, setPayload] = useState({});
	const [team, setTeam] = useState('');
	const [entity, setEntity] = useState('');

	const gender = [
		{ value: 'M', label: 'Male' },
		{ value: 'F', label: 'Female' },
		{ value: 'O', label: 'Others' },
		{ value: 'U', label: 'Unknown' }
	];

	function changeDate(e) {
		const date = moment(e.target.value).format('YYYY-MM-DD');
		setDate(date);
	}

	function changeGender(arg) {
		const e = { target: { name: 'gender', value: arg.value } };
		changeUserData(e);
	}

	function changeUserData(e) {
		setPayload({
			...payload,
			[e.target.name]: e.target.value
		});
	}

	function updateUser(e) {
		e.preventDefault();
		if (dob) payload.dob = dob;
		payload.team = team;
		updateUserDetails(id, payload)
			.then(d => {
				addToast('Successfully updated user', { appearance: 'success', autoDismiss: true });
				setUser(d);
			})
			.catch(err => {
				addToast('Something went wrong', { appearance: 'error', autoDismiss: true });
			});
	}

	function fetchUser() {
		getUserInfo(id)
			.then(res => {
				const { roles, dob, gender, team, entity } = res;
				setUser(res);
				setRoles(roles);
				setTeam(team);
				setEntity(entity);
				setDate(moment(dob).format('YYYY-MM-DD'));
				setPayload({ ...payload, gender });
			})
			.catch(err => {
				addToast('Something went wrong', { appearance: 'error', autoDismiss: true });
			});
	}

	function searchRole(value) {
		let query;
		if (!value) {
			query = {};
		} else {
			query = {
				name: value
			};
		}

		listRole(query)
			.then(d => {
				const respRoles = d.map(item => item.name);

				const newRoles = respRoles.filter(item => !roles.includes(item));

				const newOptions = newRoles.map(item => {
					return {
						value: item,
						label: item
					};
				});

				setFilteredRoles(newOptions);
			})
			.catch(err => {
				addToast('Something went wrong', { appearance: 'error', autoDismiss: true });
			});
	}

	function confirmAddRole(e) {
		Swal.fire({
			title: 'Do you want to proceed?',
			showDenyButton: true,
			confirmButtonText: `Confirm`,
			denyButtonText: `Cancel`
		}).then(result => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
				assignrole(e);
			} else if (result.isDenied) {
				Swal.fire('Changes are not saved', '', 'info');
			}
		});
	}
	function confirmRemoveRole(e) {
		Swal.fire({
			title: 'Do you want to proceed?',
			showDenyButton: true,
			// showCancelButton: true,
			confirmButtonText: `Confirm`,
			denyButtonText: `Cancel`
		}).then(result => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
				removeRole(e);
			} else if (result.isDenied) {
				Swal.fire('Changes are not saved', '', 'info');
			}
		});
	}

	function assignrole(e) {
		const { value: roles } = e;
		assignRoleToUser(id, roles)
			.then(() => {
				fetchUser();
				addToast('Succesfully assigned new role to user', { appearance: 'success', autoDismiss: true });
			})
			.catch(err => {
				addToast('Something went wrong', { appearance: 'error', autoDismiss: true });
			});
	}
	function removeRole(e) {
		const roles = e;
		removeRoleFromUser(id, roles)
			.then(() => {
				fetchUser();
				addToast('Succesfully removed role from user', { appearance: 'success', autoDismiss: true });
			})
			.catch(err => {
				addToast('Something went wrong', { appearance: 'error', autoDismiss: true });
			});
	}

	async function removeUser() {
		let result = await Swal.fire({
			title: 'Are you sure?',
			text: `This User data will be completed deleted! Make sure user is not active...`,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes'
		});
		if (result.isConfirmed) {
			try {
				let d = await deleteExEmployee(id);
				if (d) {
					addToast(`User deleted successfully.`, {
						appearance: 'success',
						autoDismiss: true
					});
					listUsers();
					history.push('/users');
				}
			} catch {
				addToast('Something went wrong on server!', {
					appearance: 'error',
					autoDismiss: true
				});
			}
		}
	}

	useEffect(fetchUser, []);
	return (
		<StyledDivFlex2>
			<Card style={{ width: '49%', minWidth: '500px' }}>
				<CardHeader>
					<CardTitle>
						<Row>
							<Col md="8">
								<i className="mdi mdi-book mr-2"></i>User Details
							</Col>
							<Col md="4" className="text-right">
								<Button color="danger" onClick={removeUser}>
									<i className="mdi mdi-delete mr-2"></i>Delete
								</Button>
							</Col>
						</Row>
					</CardTitle>
				</CardHeader>
				<CardBody>
					<FormGroup>
						<Label>Name :</Label>
						<Input
							name="name"
							value={payload && payload.name ? payload.name : user && user.name && user.name.full ? user.name.full : ''}
							onChange={e => changeUserData(e)}
						/>
					</FormGroup>
					<StyledDivFlex2>
						<StyledFormGroupW50>
							<Label>Email :</Label>
							<Input
								name="email"
								disabled={true}
								value={payload && payload.email ? payload.email : user && user.email ? user.email : ''}
								onChange={e => changeUserData(e)}
							/>
						</StyledFormGroupW50>
						<StyledFormGroupW50>
							<Label>Phone :</Label>
							<Input
								name="phone"
								value={payload && payload.phone ? payload.phone : user && user.phone ? user.phone : ''}
								onChange={e => changeUserData(e)}
							/>
						</StyledFormGroupW50>
					</StyledDivFlex2>
					<StyledDivFlex2>
						<StyledFormGroupW50>
							<Label>Gender :</Label>
							<ReactSelect
								options={gender}
								defValue={payload && payload.gender ? payload.gender : user && user.gender ? user.gender : ''}
								onSelect={changeGender}
							/>
						</StyledFormGroupW50>
						<StyledFormGroupW50>
							<Label>Date of Birth :</Label>
							<Input type="date" value={dob ? dob : ''} onChange={e => changeDate(e)} />
						</StyledFormGroupW50>
					</StyledDivFlex2>
					<StyledDivFlex2>
						<StyledFormGroupW50>
							<EntitySelector entity={{ id: entity, name: team }} onChange={e => setTeam(e.name)} />
						</StyledFormGroupW50>
					</StyledDivFlex2>
					<Button color="success" style={{ float: 'right' }} onClick={updateUser}>
						Save Changes
					</Button>
				</CardBody>
			</Card>
			<Card style={{ width: '49%', minWidth: '500px' }}>
				<CardHeader>
					<CardTitle>User Roles</CardTitle>
				</CardHeader>
				<CardBody>
					<Select
						placeholder={'Search a role to add .'}
						onInputChange={searchRole}
						options={filteredRoles}
						onChange={confirmAddRole}
					/>
					<br />
					<Table bordered striped responsive>
						<thead>
							<tr>
								<th style={{ width: '90%' }}>Role</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{roles &&
								roles.map((item, index) => (
									<tr key={index}>
										<td>{item}</td>
										<td>
											<Button size="sm" color="danger" onClick={() => confirmRemoveRole(item)}>
												<i className=" fas fa-trash"></i>
											</Button>
										</td>
									</tr>
								))}
						</tbody>
					</Table>
				</CardBody>
			</Card>
		</StyledDivFlex2>
	);
}

export default EditUser;
