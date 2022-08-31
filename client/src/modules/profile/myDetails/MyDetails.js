import React, { useState, useEffect, useContext } from 'react';
import { useToasts } from 'react-toast-notifications';
import { Card, CardBody, CardTitle, Button, Label, Row, Col } from 'reactstrap';
import { UserContext } from '../../../contexts/UserContext';
import { getUser } from '../../../utils/sessionManager';
import moment from 'moment';
import ReactSelect from '../../global/ReactSelect';

import Tour from 'reactour';
import { StyledInput, StyledDivFlex2, StyledFormGroupW50 } from '../../../assets/scss/styledCOmponent/StyledComponent';
function MyDetails() {
	const steps = [
		{
			selector: '.first-step',
			content: 'This is my first Step'
		}
	];
	const { addToast } = useToasts();
	const { _id } = getUser();
	const gender = [
		{ value: 'M', label: 'Male' },
		{ value: 'F', label: 'Female' },
		{ value: 'O', label: 'Others' },
		{ value: 'U', label: 'Unknown' }
	];
	const { updateMyDetails, getUserInfo } = useContext(UserContext);

	const [userDetails, setUserDetails] = useState(null);
	const [isTourOpen, setIsTourOpen] = useState(false);
	function fetchUserDetails() {
		getUserInfo(_id)
			.then(d => {
				const {
					gender,
					team,
					name: { full: name },
					phone,
					dob
				} = d;

				setUserDetails({ gender, team, name, phone, dob: dob ? moment(dob).format('YYYY-MM-DD') : null });
			})
			.catch(err => {
				addToast('Something went wrong', { appearance: 'error', autoDismiss: true });
			});
	}

	function updateUserDetailsChanges(e) {
		e.preventDefault();
		updateMyDetails(userDetails)
			.then(() => {
				addToast('Succesfully changed user details', { appearance: 'success', autoDismiss: true });
				fetchUserDetails();
			})
			.catch(err => {
				addToast('Something went wrong', { appearance: 'error', autoDismiss: true });
				fetchUserDetails();
			});
	}

	function changeUserData(e) {
		setUserDetails({
			...userDetails,
			[e.target.name]: e.target.value
		});
	}
	function changeGender(arg) {
		const e = { target: { name: 'gender', value: arg.value } };
		changeUserData(e);
	}

	useEffect(fetchUserDetails, []);

	return (
		<>
			<Tour steps={steps} isOpen={isTourOpen} onRequestClose={() => setIsTourOpen(false)} />
			<Row style={{ marginTop: '.5rem' }}>
				<Col md="8">
					<Card>
						<CardTitle className="mb-0 p-3 border-bottom bg-light">
							<Row>
								<Col md="4">{userDetails && userDetails.name ? userDetails.name : 'N/A'}</Col>
							</Row>
						</CardTitle>
						<CardBody>
							<StyledDivFlex2>
								<StyledFormGroupW50>
									<Label> Name :</Label>
									<StyledInput
										value={userDetails && userDetails.name ? userDetails.name : 'N/A'}
										name="name"
										onChange={e => changeUserData(e)}
									/>
								</StyledFormGroupW50>
								<StyledFormGroupW50>
									<Label> Phone :</Label>
									<StyledInput
										value={userDetails && userDetails.phone ? userDetails.phone : 'N/A'}
										type="number"
										name="phone"
										onChange={e => changeUserData(e)}
									/>
								</StyledFormGroupW50>
							</StyledDivFlex2>
							<StyledDivFlex2>
								<StyledFormGroupW50>
									<Label> Gender :</Label>
									<ReactSelect
										options={gender}
										defValue={userDetails && userDetails.gender ? userDetails.gender : ''}
										onSelect={changeGender}
									/>
								</StyledFormGroupW50>
								<StyledFormGroupW50>
									<Label> Date of Birth :</Label>
									<StyledInput
										type="date"
										value={userDetails && userDetails.dob ? userDetails.dob : 'N/A'}
										name="dob"
										onChange={e => changeUserData(e)}
									/>
								</StyledFormGroupW50>
							</StyledDivFlex2>

							<br />
							<Button size="sm" color="success" onClick={updateUserDetailsChanges}>
								Save Changes
							</Button>
						</CardBody>
					</Card>
				</Col>
			</Row>
		</>
	);
}

export default MyDetails;
