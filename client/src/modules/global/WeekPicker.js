import React, { useEffect } from 'react';
import { Input, Button } from 'reactstrap';
import moment from 'moment';

function WeekPicker({ week, setWeek, disabledButtons, disable = false }) {
	function handleWeekChange(e) {
		setWeek(e.target.value);
	}

	function changeWeek(params) {
		let newWeek;
		newWeek = moment(week).add(params, 'weeks').format('YYYY-WW').replace('-', '-W');
		setWeek(newWeek);
		return;
	}
	function setNewWeek() {
		if (week) {
			setWeek(week);
			return;
		}
		let today = moment().format('YYYY-WW').replace('-', '-W');
		setWeek(today);
	}
	useEffect(setNewWeek, [week]);

	return (
		<span className="d-flex">
			{!disabledButtons && (
				<Button color="white" onClick={() => changeWeek(-1)}>
					<i className="fas fa-arrow-left"></i>
				</Button>
			)}
			<Input
				type="week"
				name="week"
				value={week ? week : ''}
				className="form-field"
				onChange={handleWeekChange}
				required
				disabled={disable}
			/>
			{!disabledButtons && (
				<Button color="white" onClick={() => changeWeek(1)}>
					<i className="fas fa-arrow-right"></i>
				</Button>
			)}
		</span>
	);
}

export default WeekPicker;
