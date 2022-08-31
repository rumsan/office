import React, { useState, useContext, useEffect } from 'react';
import { useToasts } from 'react-toast-notifications';
import Swal from 'sweetalert2';
import { Button, Row, Card, CardBody, CardTitle, Col, Input, Table, CardHeader, FormGroup, Label } from 'reactstrap';
import CustomModal from '../../global/CustomModal';
import { UserContext } from '../../../contexts/UserContext';
import Paginate from '../../global/Paginate';
import { Link } from 'react-router-dom';
import AddUser from '../add';
import ReactSelect from '../../global/ReactSelect';
import { StyledTbody } from '../../../assets/scss/styledCOmponent/StyledComponent';

function Users() {
	const { addToast } = useToasts();
	const [current, setCurrent] = useState(0);
	const [userForm, setUserForm] = useState({});
	const [modal, setModal] = useState(false);
	const [errors, setErrors] = useState(null);

	const queryOptions = [
		{ value: 'email', label: ' Search by Email' },
		{ value: 'name', label: 'Search by Name' }
	];

	const [searchValue, setSearchValue] = useState(null);
	const [searchOptions, setSearchOptions] = useState(queryOptions[0]);
	const { list, pagination, listUsers, changeStatus, addUser } = useContext(UserContext);
	const handleAddUser = () => {
		setModal(!modal);
	};
	const handleModalClose = () => {
		setUserForm({});
		setModal(!modal);
	};

	function handleSearchInputChange(e) {
		setSearchValue(e);
		fetchAllUsers({ start: 0, limit: pagination.limit, [searchOptions.value]: e });
	}

	function fetchAllUsers(query = { start: 0, limit: 20 }) {
		let params = { ...pagination, ...query };
		listUsers(params)
			.then()
			.catch(err => {
				addToast('Something went wrong', { appearance: 'error', autoDismiss: true });
			});
	}

	const handlePagination = current_page => {
		let _start = current_page * pagination.limit;
		setCurrent(current_page);
		// let query = { name: searchText };
		// if (filter.searchBy === searchOptions.ADDRESS) {
		// 	query = { baserate: searchText };
		// }
		return fetchAllUsers({
			start: _start,
			limit: pagination.limit
		});
	};
	function confirmStatusChange(id, status) {
		Swal.fire({
			title: `Do you want to ${status ? 'deactivate' : 'activate'} this user`,
			showDenyButton: true,
			// showCancelButton: true,
			confirmButtonText: `Confirm`,
			denyButtonText: `Dismiss`
		}).then(result => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
				changeUserStatus(id, status);
			} else if (result.isDenied) {
				Swal.fire('Changes are not saved', '', 'info');
			}
		});
	}

	function changeUserStatus(id, status) {
		const userStatus = status ? 'false' : 'true';
		changeStatus(id, userStatus)
			.then(() => {
				addToast('User Status changed successfully', { appearance: 'success', autoDismiss: true });
			})
			.catch(err => {
				addToast('Something went wrong', { appearance: 'error', autoDismiss: true });
			});
	}

	function handleAddUserFormSubmit(e) {
		e.preventDefault();
		if (
			!Object.keys(userForm).length ||
			!['gender', 'is_employee', 'roles', 'team'].every(x => {
				return x in userForm;
			})
		) {
			setErrors('All fiels are required');
			setTimeout(() => {
				setErrors(null);
			}, 500);
			return;
		}

		addUser(userForm)
			.then(() => {
				addToast('User added successfully', { appearance: 'success', autoDismiss: true });
				setUserForm({});
				setModal(!modal);
			})
			.catch(err => {
				addToast('Something went wrong', { appearance: 'error', autoDismiss: true });
			});
	}

	function changeSearchQuery(args) {
		setSearchOptions(args);
	}

	useEffect(fetchAllUsers, []);
	return (
		<>
			<Card>
				<CardHeader style={{ maxHeight: '4rem' }}>
					<Row>
						<Col>
							<CardTitle>
								<i className="fa fa-user"></i>&nbsp; System Users
							</CardTitle>
						</Col>
						<Col md="4">
							<div
								style={{
									float: 'right',
									marginBottom: '0.5rem',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between'
								}}
							>
								<div style={{ minWidth: '10rem', margin: '0 0.2rem' }}>
									<ReactSelect
										options={queryOptions}
										defValue={searchOptions && searchOptions.value ? searchOptions.value : ''}
										onSelect={changeSearchQuery}
									/>
								</div>

								<Input
									type="text"
									value={searchValue ? searchValue : ''}
									onChange={e => handleSearchInputChange(e.target.value)}
								/>
							</div>
						</Col>
						<Col md="2">
							<Button
								style={{ float: 'right', color: 'white', alignSelf: 'center' }}
								color="success"
								size="sm"
								onClick={() => handleAddUser()}
							>
								<i className="fa fa-plus"></i>&nbsp;Add User
							</Button>
						</Col>
					</Row>
				</CardHeader>

				<CardBody>
					{list && list.length > 0 ? (
						<>
							<Table striped hover bordered responsive>
								<thead>
									<tr>
										<th>Name</th>
										<th>Phone</th>
										<th>Email</th>
										<th>Gender</th>
										{/* <th>Public Key</th> */}
										<th>isActive ?</th>
										<th>Action</th>
									</tr>
								</thead>
								<StyledTbody>
									{list.map((item, index) => (
										<tr key={index}>
											<td>{item.full_name ? item.full_name : ''}</td>
											<td>{item.phone ? item.phone : ''}</td>
											<td>{item.email ? item.email : ''}</td>
											<td>{item.gender ? item.gender : ''}</td>
											{/* <td>{item.public_key ? item.public_key : ''}</td> */}
											<td
												style={{
													padding: '0.5rem',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													border: 'none'
												}}
											>
												<FormGroup check>
													<Label check>
														<Input
															type="checkbox"
															checked={item.is_active ? true : false}
															onChange={() => confirmStatusChange(item._id, item.is_active)}
														/>
													</Label>
												</FormGroup>
											</td>
											<td width="100" style={{ textAlign: 'center' }}>
												<Link to={`/users/${item._id}`}>
													<i className=" fas fa-edit"></i>
												</Link>
											</td>
										</tr>
									))}
								</StyledTbody>
							</Table>
							<Paginate
								limit={pagination.limit}
								total={pagination.total}
								current={current}
								onChange={handlePagination}
							/>
						</>
					) : (
						'No data found.'
					)}
				</CardBody>
			</Card>
			<CustomModal
				open={modal}
				setOpen={handleAddUser}
				title="Add New User"
				size="lg"
				handleSubmit={handleAddUserFormSubmit}
				handleCancel={handleModalClose}
			>
				<AddUser formData={userForm} setForm={setUserForm} errors={errors} />
			</CustomModal>
		</>
	);
}

export default Users;
