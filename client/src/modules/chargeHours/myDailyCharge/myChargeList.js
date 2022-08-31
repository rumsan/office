import React from 'react';
import { Col, Container, Row, Button, Badge } from 'reactstrap';
import styled from 'styled-components';
import moment from 'moment';

function MyChargeList({ list, handleDelete, handleEdit }) {
	const compareDates = date => {
		const fourWeeksAgo = moment(new Date()).add(-28, 'days').format();
		return new Date(fourWeeksAgo) < new Date(date);
	};

	return (
		<>
			{list?.length ? (
				list.map((item, index) => (
					<ChargeSheetsDiv background={index && index % 2 === 0 ? 'dark' : index === 0 ? 'dark' : 'light'} key={index}>
						<Container>
							<Row>
								<Col md={8}>
									<Row>
										<Col sm={12}>
											<strong>{item.details}</strong>
										</Col>
										<Col sm={12}>
											<div>Project: {item.project.name}</div>
										</Col>
									</Row>
								</Col>
								<Col md={4} className="text-center" style={{ alignSelf: 'center' }}>
									<h4>
										<Badge className="bg-success" pill>
											{item.hours} hrs
										</Badge>
									</h4>
								</Col>
							</Row>
						</Container>
						{compareDates(item.date) && (
							<ButtonGroup>
								<Button size="sm" color="success" style={{ marginRight: '0.2rem' }} onClick={() => handleEdit(item)}>
									<i className="fas fa-edit"></i>
								</Button>
								<Button
									size="sm"
									color="danger"
									style={{ marginRight: '0.2rem' }}
									onClick={() => handleDelete(item._id)}
								>
									<i className="fas fa-trash"></i>
								</Button>
							</ButtonGroup>
						)}
					</ChargeSheetsDiv>
				))
			) : (
				<Title>No Charge Hours has been added for this date</Title>
			)}
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

const ButtonGroup = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

export default MyChargeList;
