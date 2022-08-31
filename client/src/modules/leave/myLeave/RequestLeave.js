import React, { useState } from 'react';
import { Row, Input, Button, Label, FormGroup, Col } from 'reactstrap';
import CustomModal from '../../global/CustomModal';
import DatePicker from '../../global/DatePicker';
import moment from 'moment';

import ReactSelect from '../../global/ReactSelect';
import LeaveTypes from '../../../constants/leaveTypes';
import { useToasts } from 'react-toast-notifications';
import * as LEAVESERVICE from '../../../services/leave';

import { ErrorMsg, StyledDivFlex2, StyledFormGroupW50 } from '../../../assets/scss/styledCOmponent/StyledComponent';

function RequestLeave() {
	const { addToast } = useToasts();
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
		LEAVESERVICE.requestLeave(formData)
			.then(() => {
				addToast('Succesfully issued leave request', { appearance: 'success', autoDismiss: true });
				toggle();
			})
			.catch(err => {
				addToast('Somethin went wrong', { appearance: 'error', autoDismiss: true });
				toggle();
			});
	}

	return (
		<>
			<Row style={{ marginTop: '.8rem' }}>
				<Col>
					<Button color="success" onClick={toggle}>
						Request Leave
					</Button>
				</Col>
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
			</Row>
		</>
	);
}

export default RequestLeave;
