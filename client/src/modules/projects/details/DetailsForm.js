import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Button, Form, FormGroup, Label, Input, Card, CardTitle, CardBody } from 'reactstrap';
import { Link, useHistory } from 'react-router-dom';
import { Context } from '../core/contexts';
import { useToasts } from 'react-toast-notifications';
import Spinner from '../../../modules/spinner';
import moment from 'moment';
import Swal from 'sweetalert2';
import { CustomerSelector, EntitySelector, UserSelector } from '..';
import ProjectChargeHours from '../../chargeHours/projectCharge';

const DetailForm = props => {
	const Id = props.params.id;
	const history = useHistory();
	const { addToast } = useToasts();
	const { list, update, remove, get } = useContext(Context);
	const [detail, setDetail] = useState(null);
	const [customer, setCustomer] = useState(null);
	const [entity, setEntity] = useState(null);
	const [members, setMembers] = useState(null);

	const submitUpdate = e => {
		e.preventDefault();
		const {
			id,
			_id,
			__v,
			created_at,
			updated_at,
			updated_by,
			created_by,
			is_archived,
			budgeted_hours,
			is_system,
			...rest
		} = detail;
		let formData = { ...rest };
		formData.customer = customer;
		formData.entity = entity;
		formData.members = members;
		update(Id, formData).then(d => {
			Swal.fire('Successful!', 'Project Details updated successfully.', 'success')
				.then(d => {
					get(Id);
				})
				.catch(err => {
					addToast('Something went wrong on server!', {
						appearance: 'error',
						autoDismiss: true
					});
				});
		});
	};

	async function removeData(Id) {
		let result = await Swal.fire({
			title: 'Are you sure?',
			text: `This data will be archived!`,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes'
		});
		if (result.isConfirmed) {
			try {
				let d = await remove(Id);
				if (d) {
					addToast(`Project Archived successfully.`, {
						appearance: 'success',
						autoDismiss: true
					});
					list();
					history.push('/projects');
				}
			} catch {
				addToast('Something went wrong on server!', {
					appearance: 'error',
					autoDismiss: true
				});
			}
		}
	}

	const loaddetail = () => {
		get(Id)
			.then(d => {
				setDetail(d);
				setCustomer(d.customer);
				setEntity(d.entity);
				setMembers(d.members);
			})
			.catch(() => {
				addToast('Something went wrong!', {
					appearance: 'error',
					autoDismiss: true
				});
			});
	};

	useEffect(loaddetail, []);
	return (
		<>
			{detail ? (
				<div>
					<Card>
						<CardTitle className="mb-0 p-3 border-bottom bg-light">
							<Row>
								<Col md="8">
									<i className="mdi mdi-book mr-2"></i>Project Detail
								</Col>
								<Col md="4" className={detail && detail.is_system ? 'd-none' : ''}>
									<Button color="danger" onClick={() => removeData(detail._id)} className="float-right">
										<i className="mdi mdi-delete mr-2"></i>Archive
									</Button>
								</Col>
							</Row>
						</CardTitle>

						<CardBody>
							<Form onSubmit={submitUpdate}>
								<div className="basic detail">
									<Row>
										<Col md="12">
											<Row>
												<Col md="4">
													<div className="form-item">
														<EntitySelector entity={entity} onChange={e => setEntity(e)} disabled={true} />
													</div>
												</Col>
												<Col md="4">
													<FormGroup>
														<Label for="title">Name</Label>
														<Input
															type="text"
															name="name"
															value={detail ? detail.name : ''}
															disabled={detail && detail.is_system ? true : false}
															onChange={e => setDetail({ ...detail, [e.target.name]: e.target.value })}
															placeholder="Enter Name"
														/>
													</FormGroup>
												</Col>
												<Col md="4">
													<FormGroup>
														<CustomerSelector
															disabled={detail && detail.is_system ? true : false}
															customer={customer}
															onChange={e => setCustomer(e)}
														/>
													</FormGroup>
												</Col>
												<Col md="4">
													<FormGroup>
														<label htmlFor="deadline">Deadline</label>
														<br />
														<Input
															name="deadline"
															type="date"
															className="form-field"
															disabled={detail && detail.is_system ? true : false}
															defaultValue={detail ? moment(detail.deadline).format('YYYY-MM-DD') : ''}
															onChange={e => setDetail({ ...detail, [e.target.name]: e.target.value })}
														/>
													</FormGroup>
												</Col>
												<Col md="12">
													<div className="form-item">
														<UserSelector
															disabled={detail && detail.is_system ? true : false}
															users={members}
															onChange={e => setMembers(e)}
														/>
													</div>
												</Col>
												<hr />
											</Row>
										</Col>
									</Row>
								</div>
								<br />
								<br />
								<Button color="success" type="submit" className={detail && detail.is_system ? 'd-none' : ''}>
									Submit
								</Button>
								<Link to="/technicians" className="btn btn-dark ml-2">
									Cancel
								</Link>
							</Form>
						</CardBody>
					</Card>
					<ProjectChargeHours project={Id} />
				</div>
			) : (
				<Spinner />
			)}
		</>
	);
};
export default DetailForm;
