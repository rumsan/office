import React, { useEffect } from 'react';
import { Input, Button } from 'reactstrap';
import moment from 'moment';

function DatePicker({ date, setDate, disabledButtons, disable = false }) {
	function handleDateChange(e) {
		setDate(e.target.value);
	}

	function changeDate(params) {
		let newDate;
		newDate = moment(date).add(params, 'days').format('YYYY-MM-DD');
		setDate(newDate);
		return;
	}
	function setNewDate() {
		if (date) {
			let today = moment(date).format('YYYY-MM-DD');
			setDate(today);
			return;
		}
		let today = moment().format('YYYY-MM-DD');
		setDate(today);
	}
	useEffect(setNewDate, [date]);

	return (
		<span className="d-flex">
			{!disabledButtons && (
				<Button color="white" onClick={() => changeDate(-1)}>
					<i className="fas fa-arrow-left"></i>{' '}
				</Button>
			)}
			<Input
				type="date"
				name="date"
				disabled={disable}
				value={date ? date : ''}
				className="form-field"
				onChange={handleDateChange}
				required
			/>
			{!disabledButtons && (
				<Button color="white" onClick={() => changeDate(1)}>
					<i className="fas fa-arrow-right"></i>
				</Button>
			)}
		</span>
	);
}

export default DatePicker;
