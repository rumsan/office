import React, { useEffect, useContext } from 'react';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { Row, Col, Card, CardTitle, CardBody, Container, Badge } from 'reactstrap';
import { ChargeHoursContext } from '../../../contexts/ChargeHoursContext';
import { useToasts } from 'react-toast-notifications';
import styled from 'styled-components';
import moment from 'moment';

function List({ props }) {
	const { project } = props;
	const { addToast } = useToasts();
	const { list, listChargeSheet } = useContext(ChargeHoursContext);

	const fetchByProject = (query = {}) => {
		listChargeSheet({ project, ...query })
			.then(() => '')
			.catch(err => addToast(err.message, { appearance: 'error', autoDismiss: true }));
	};

	useEffect(fetchByProject, []);
	return (
		<>
			<Card>
				<CardTitle className="mb-0 p-3 border-bottom bg-light">
					<Row>
						<Col md="10">
							<i className="mdi mdi-border-right mr-2"></i>Charge Hours
						</Col>
						<Col md="2" className="text-center">
							<Badge className="bg-success" pill>
								Total: {'  '}
								{list?.map(c => c.hours).reduce((a, b) => a + b, 0)} hrs{' '}
							</Badge>
						</Col>
					</Row>
				</CardTitle>
				<CardBody>
					{list?.length ? (
						list.map((item, index) => (
							<ChargeSheetsDiv
								background={index && index % 2 === 0 ? 'dark' : index === 0 ? 'dark' : 'light'}
								key={index}
							>
								<Container>
									<Row>
										<Col xs={10}>
											<Row>
												<Col xs={12}>
													<strong>{item.details}</strong>
												</Col>
												<Col xs={12}>
													<strong>Project:</strong> {item.project.name} {' || '}
													<strong>Date:</strong> {moment(item.date).format('YYYY-MM-DD')}
													{' || '}
													<strong>By:</strong> {item.userName}
												</Col>
											</Row>
										</Col>
										<Col xs={2} className="text-center" style={{ alignSelf: 'center' }}>
											<h4>
												<Badge className="bg-success" pill>
													{item.hours} hrs
												</Badge>
											</h4>
										</Col>
									</Row>
								</Container>
							</ChargeSheetsDiv>
						))
					) : (
						<Title>No Charge Hours has been added for this date</Title>
					)}
				</CardBody>
			</Card>
		</>
	);
}

const ChargeSheetsDiv = styled.div`
	padding: 0.4rem;
	display: flex;
	justify-content: space-between;
	background: ${props => (props.background === 'light' ? 'white' : 'rgb(242, 242, 242)')};
	box-sizing: border-box;
	margin-bottom: 0.3rem;
`;

const Title = styled.p`
	font-weight: 500;
	font-size: 0.9rem;
`;

export default List;
