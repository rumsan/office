import React, { useEffect } from 'react';
import { Input, Button, InputGroup, InputGroupAddon } from 'reactstrap';
import moment from 'moment';
import styled from 'styled-components';

function CustomWeekPicker({ date, weekRange, setWeekRange, disable = false, disabledButtons = false }) {
	function changeDate(params) {
		let newStartAndEndDate = {};
		newStartAndEndDate.startDate = moment(weekRange.startDate).add(params, 'days').format('YYYY-MM-DD');
		newStartAndEndDate.endDate = moment(weekRange.endDate).add(params, 'days').format('YYYY-MM-DD');
		setWeekRange(newStartAndEndDate);
	}

	function checkCurrentOrFutureWeek(weekRange) {
		const { endDate } = weekRange;
		const currentDay = moment(new Date()).format('YYYY-MM-DD');
		const { endDate: currentWeekEndDate } = getWeekRange(currentDay);
		return new Date(endDate) >= new Date(currentWeekEndDate);
	}

	const getWeekRange = date => {
		let day = moment(date).day();
		const startDate =
			day !== 6
				? moment(date)
						.add(-(day + 1), 'days')
						.format('YYYY-MM-DD')
				: moment(date);
		const endDate = moment(startDate).add(6, 'days').format('YYYY-MM-DD');
		return { startDate, endDate };
	};

	function setNewWeek(date) {
		const passedDate = date || moment(new Date()).format('YYYY-MM-DD');
		const range = getWeekRange(passedDate);
		setWeekRange(range);
		return;
	}

	useEffect(() => setNewWeek(date), [date]);

	return (
		<>
			<span className="d-flex">
				{!disabledButtons && (
					<Button color="white" onClick={() => changeDate(-7)}>
						<i className="fas fa-arrow-left"></i>{' '}
					</Button>
				)}
				<InputGroup>
					<Input
						style={{ fontWeight: 'bolder' }}
						disabled={true}
						value={moment(weekRange.startDate).format('MMM Do') + ' - ' + moment(weekRange.endDate).format('MMM Do')}
						className="form-field"
						onChange={() => ''}
					/>
					<InputGroupAddon addonType="append" style={{ position: 'absolute', right: 1, top: 0, bottom: 0 }}>
						<DateInput
							type="date"
							max={getWeekRange(new Date()).endDate}
							id="dateSelector"
							disabled={disable}
							value={moment(weekRange.endDate).format('YYYY-MM-DD')}
							onChange={e => setNewWeek(e.target.value)}
							style={{
								border: 'none',
								background: 'transparent'
							}}
						/>
					</InputGroupAddon>
				</InputGroup>
				{!disabledButtons && !checkCurrentOrFutureWeek(weekRange) && (
					<Button color="white" onClick={() => changeDate(7)}>
						<i className="fas fa-arrow-right"></i>
					</Button>
				)}
			</span>
		</>
	);
}

const DateInput = styled.input`
	&::-webkit-calendar-picker-indicator {
		display: block;
	}
	&::-webkit-datetime-edit-fields-wrapper {
		display: none;
	}
`;

export default CustomWeekPicker;
