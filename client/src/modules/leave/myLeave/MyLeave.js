import React, { useState, useEffect, useContext } from 'react';
import { LeaveContext } from '../../../contexts/LeaveContext';
import { Card, CardBody, CardTitle, Input, Button, Label, FormGroup, Row, Col, Table } from 'reactstrap';
import CustomModal from '../../global/CustomModal';
import DatePicker from '../../global/DatePicker';
import moment from 'moment';

import ReactSelect from '../../global/ReactSelect';
import LeaveTypes from '../../../constants/leaveTypes';
import { useToasts } from 'react-toast-notifications';
import { getUser } from '../../../utils/sessionManager';
import {
	ErrorMsg,
	StyledDivFlex2,
	StyledFormGroupW50,
	StyledTbody
} from '../../../assets/scss/styledCOmponent/StyledComponent';
import Paginate from '../../global/Paginate';

function MyLeave() {
	const { addToast } = useToasts();
	const [current, setCurrent] = useState(0);

	const { _id } = getUser();
	const { requestLeave, list, pagination, listLeaveRequest } = useContext(LeaveContext);
	const [open, setModalOpen] = useState(false);
	const [startDate, setStartDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
	const [endDate, setEndDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
	const [formError, setFormError] = useState(null);
	const [formData, setFormData] = useState({ type: LeaveTypes[0].value });
	function toggle() {
		setModalOpen(!open);
		setFormData({ type: LeaveTypes[0].value });
	}
	function selectLeaveType(args) {
		const e = { target: { value: args.value, name: 'type' } };
		changeFormDate(e);
	}
	function changeFormDate(e) {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	}
	function submitForm(e) {
		e.preventDefault();
		if (moment(startDate).isAfter(endDate)) {
			setFormError('Start date cannot be greater than end date');
			setTimeout(() => {
				setFormError(null);
			}, 1000);
			return;
		}
		formData.startDate = startDate;
		formData.endDate = endDate;
		requestLeave(formData)
			.then(() => {
				addToast('Succesfully issued leave request', { appearance: 'success', autoDismiss: true });
				fetchList();
				toggle();
			})
			.catch(err => {
				addToast('Somethin went wrong', { appearance: 'error', autoDismiss: true });
				toggle();
			});
	}

	function fetchList(query = { start: 0, limit: 20 }) {
		query.user = _id;
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
	useEffect(fetchList, []);

	return (
		<>
			<Row style={{ marginTop: '.5rem' }}>
				<Col md="8">
					<Card>
						<CardTitle className="mb-0 p-3 border-bottom bg-light">
							<Row>
								<Col>My Leaves</Col>
								<Col md="2" style={{ float: 'right' }}>
									<Button size="sm" color="success" onClick={toggle}>
										Request Leave
									</Button>
								</Col>
							</Row>
						</CardTitle>
						<CardBody>
							{list && list.length ? (
								<>
									<Table striped hover bordered responsive>
										<thead>
											<tr>
												<th>Leave Type</th>
												<th>Start Date</th>
												<th>End Date</th>
												<th>is_approved</th>
											</tr>
										</thead>
										<StyledTbody>
											{list.map((item, i) => (
												<tr key={i}>
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
														<Button size="sm" color={item.is_approved ? 'success' : 'warning'}>
															{item.is_approved ? 'Approved' : 'Not Approved'}
														</Button>
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
								'No data available'
							)}
						</CardBody>
					</Card>
				</Col>
			</Row>

			<CustomModal
				open={open}
				setOpen={setModalOpen}
				title="Request for leave"
				size="lg"
				handleSubmit={submitForm}
				handleCancel={toggle}
			>
				{formError && <ErrorMsg>***&nbsp;{formError}&nbsp;***</ErrorMsg>}
				<StyledDivFlex2>
					<StyledFormGroupW50>
						<Label>Leave Type :</Label>
						<ReactSelect options={LeaveTypes} onSelect={selectLeaveType} defValue={LeaveTypes[0].value} />
					</StyledFormGroupW50>
					<StyledFormGroupW50>
						<Label>Start Date :</Label>
						<DatePicker date={startDate} setDate={setStartDate} disabledButtons={true} />
					</StyledFormGroupW50>
					<StyledFormGroupW50>
						<Label>End Date :</Label>
						<DatePicker date={endDate} setDate={setEndDate} disabledButtons={true} />
					</StyledFormGroupW50>
					{/* <StyledFormGroupW50>
						<Label>Is this sick leave?</Label>
						<FormGroup check inline>
							<Input type="checkbox" className="css-1utwwx4" />
							<Label check>Yes</Label>
						</FormGroup>
					</StyledFormGroupW50> */}
				</StyledDivFlex2>
				<FormGroup>
					<Label>Reason :</Label>
					<Input
						type="textarea"
						name="reason"
						value={formData && formData.reason ? formData.reason : ''}
						required
						onChange={e => changeFormDate(e)}
					/>
				</FormGroup>
			</CustomModal>
		</>
	);
}

export default MyLeave;
