import React, { useState, useEffect, useContext } from 'react';
import { LeaveContext } from '../../../contexts/LeaveContext';
import { Card, Table, CardTitle, Row, Col, CardBody, FormGroup, Input, Label, Button, ButtonGroup } from 'reactstrap';
import { useToasts } from 'react-toast-notifications';
import moment from 'moment';
import Paginate from '../../global/Paginate';
import {
	StyledTbody,
	StyledDivFlex2,
	StyledFormGroupW50,
	StyledLabel,
	StyledOutput,
	StyledFormGroupW30,
	StyledFormGroupW100
} from '../../../assets/scss/styledCOmponent/StyledComponent';
import Swal from 'sweetalert2';
import CustomModal from '../../global/CustomModal';

function LeaveList() {
	const { addToast } = useToasts();
	const [current, setCurrent] = useState(0);
	const { listLeaveRequest, list, pagination, changeRequest, deleteLeaveRequest } = useContext(LeaveContext);
	const [open, setOpen] = useState(false);
	const [requestDetail, setRequestDetails] = useState(null);

	function toggleModal(item) {
		setRequestDetails(item);
		setOpen(!open);
	}
	function fetchList(query = { start: 0, limit: 20 }) {
		let params = { ...pagination, ...query };
		listLeaveRequest(params)
			.then()
			.catch(err => {
				addToast('something went wrong', { appearance: 'error', autoDismiss: true });
			});
	}

	const handlePagination = current_page => {
		let _start = current_page * pagination.limit;
		setCurrent(current_page);
		return fetchList({
			start: _start,
			limit: pagination.limit
		});
	};

	function confirmAprrove(id, is_approved) {
		let payload = { is_approved: !is_approved };
		Swal.fire({
			title: 'Are you sure?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes'
		}).then(result => {
			if (result.isConfirmed) {
				changeRequestStatus(id, payload);
			}
		});
	}

	function changeRequestStatus(id, payload) {
		changeRequest(id, payload)
			.then(() => {
				addToast('Successfully Changed leave request status', { appearance: 'success', autoDismiss: true });
				fetchList();
			})
			.catch(err => {
				addToast('Something went wrong', { appearance: 'error', autoDismiss: true });
			});
	}
	function deleteRequest(id) {
		Swal.fire({
			title: 'Are you sure?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes'
		}).then(result => {
			if (result.isConfirmed) {
				// changeRequestStatus(id, payload);
				deleteLeaveRequest(id)
					.then(() => {
						addToast('Successfully deleted', { appearance: 'success', autoDismiss: true });
						fetchList();
					})
					.catch(err => {
						addToast('Something went wrong', { appearance: 'error', autoDismiss: true });
					});
			}
		});
	}
	useEffect(fetchList, []);
	return (
		<>
			<CustomModal title="Leave Request Details" open={open} setOpen={setOpen}>
				{requestDetail && (
					<>
						<StyledDivFlex2>
							<StyledFormGroupW50>
								<StyledLabel>Requester:</StyledLabel>
								<StyledOutput>
									{requestDetail.user.name && `${requestDetail.user.name.first} ${requestDetail.user.name.last}`}
								</StyledOutput>
							</StyledFormGroupW50>
							<StyledFormGroupW50>
								<StyledLabel>Team:</StyledLabel>
								<StyledOutput>{requestDetail.user.team}</StyledOutput>
							</StyledFormGroupW50>
						</StyledDivFlex2>
						<StyledDivFlex2>
							<StyledFormGroupW30>
								<StyledLabel>Leave Type:</StyledLabel>
								<StyledOutput>{requestDetail.type}</StyledOutput>
							</StyledFormGroupW30>
							<StyledFormGroupW30>
								<StyledLabel>Start Date:</StyledLabel>
								<StyledOutput>{moment(requestDetail.startDate).format('YYYY-MM-DD')}</StyledOutput>
							</StyledFormGroupW30>
							<StyledFormGroupW30>
								<StyledLabel>End Date:</StyledLabel>
								<StyledOutput>{moment(requestDetail.endDate).format('YYYY-MM-DD')}</StyledOutput>
							</StyledFormGroupW30>
						</StyledDivFlex2>
						<StyledDivFlex2>
							<StyledFormGroupW100>
								<StyledLabel>Reason :</StyledLabel>
								<StyledOutput>{requestDetail.reason}</StyledOutput>
							</StyledFormGroupW100>
						</StyledDivFlex2>
					</>
				)}
			</CustomModal>
			<Card>
				<CardTitle className="mb-0 p-3 border-bottom bg-light">
					<Row>
						<Col md="4">
							<i className="mdi mdi-border-right mr-2"></i>Leave Requests
						</Col>

						{/* <Col md="6" className="ml-auto mr-4">
									<DatePicker date={date} setDate={setDate} />
								</Col> */}
					</Row>
				</CardTitle>
				<CardBody>
					{list && list.length ? (
						<>
							<Table striped hover bordered responsive>
								<thead>
									<tr>
										<th>Name</th>
										<th>Email</th>
										<th>Team</th>
										<th>Leave Type</th>
										<th>Start Date</th>
										<th>End Date</th>
										<th>is_approved</th>
										<th>Action</th>
									</tr>
								</thead>
								<StyledTbody>
									{list.map((item, i) => (
										<tr key={i}>
											<td>{item.user && item.user.name && `${item.user.name.first} ${item.user.name.last}`}</td>

											<td>{item.user && item.user.email}</td>
											<td>{item.user && item.user.team}</td>

											<td>{item && item.type === 'half day' ? 'Half Day' : 'Full Day'}</td>
											<td>{item && item.startDate && moment(item.startDate).format('YYYY-MM-DD')}</td>
											<td>{item && item.endDate && moment(item.endDate).format('YYYY-MM-DD')}</td>
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
															checked={item.is_approved ? true : false}
															onChange={() => confirmAprrove(item._id, item.is_approved)}
														/>
													</Label>
												</FormGroup>
											</td>
											<td>
												<ButtonGroup size="sm">
													<Button size="sm" color="danger" onClick={() => deleteRequest(item._id)}>
														<i className="fas fa-trash"></i>
													</Button>
													<Button
														size="sm"
														color="info"
														onClick={() => toggleModal(item)}
														style={{ marginLeft: '10px' }}
													>
														<i className="fas fa-eye"></i>
													</Button>
												</ButtonGroup>
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
						'No Data Available'
					)}
				</CardBody>
			</Card>
		</>
	);
}

export default LeaveList;
