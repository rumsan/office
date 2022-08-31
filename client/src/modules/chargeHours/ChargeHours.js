import React, { useState, useEffect, useContext } from 'react';

import { Card, CardBody, CardTitle, Row, Col } from 'reactstrap';
import CustomWeekPicker from '../global/CustomWeekPicker';
import List from './list';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { ChargeHoursContext } from '../../contexts/ChargeHoursContext';
import { useToasts } from 'react-toast-notifications';
import * as SessionManager from '../../utils/sessionManager';

function ChargeHours() {
	const team = SessionManager.getUserTeamName();
	const [weekRange, setWeekRange] = useState({});
	const [teamMembers, setTeamMembers] = useState([]);
	const { addToast } = useToasts();
	const { listChargeSheet, list } = useContext(ChargeHoursContext);

	function fetchChargeSheets() {
		const { startDate, endDate } = weekRange;
		if (!startDate || !endDate) return;
		listChargeSheet({ startDate, endDate })
			.then(d => {
				const filteredTeamMembers = d.users.filter(d => d.team === team);
				setTeamMembers(filteredTeamMembers);
			})
			.catch(err => {
				addToast('Something went wrong', { appearance: 'error', autoDismiss: true });
			});
	}

	useEffect(fetchChargeSheets, [weekRange]);

	return (
		<>
			<Row>
				<Col md="12">
					<Card>
						<CardTitle className="mb-0 p-3 border-bottom bg-light">
							<Row>
								<Col md="8">
									<i className="mdi mdi-border-right mr-2"></i> Charge Hours
								</Col>
								<Col md="4">
									<CustomWeekPicker weekRange={weekRange} setWeekRange={setWeekRange} />
								</Col>
							</Row>
						</CardTitle>
						<CardBody>
							<List members={teamMembers} list={list} reFetch={fetchChargeSheets} />
						</CardBody>
					</Card>
				</Col>
			</Row>
		</>
	);
}

export default ChargeHours;
