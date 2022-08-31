import React from 'react';
import { Col, Container, Row, Badge } from 'reactstrap';
import styled from 'styled-components';

function RenderTask({ props }) {
	const { sheets } = props;

	return (
		<>
			{sheets && sheets.length
				? sheets.map((item, index) => (
						<ChargeSheetsDiv
							background={index && index % 2 === 0 ? 'dark' : index === 0 ? 'dark' : 'light'}
							key={index}
						>
							<Container>
								<Row>
									<Col xs={10}>
										<strong>{item.details}</strong>
										<div>Project: {item.project.name}</div>
									</Col>
									<Col xs={2} className="text-center">
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
				: ''}
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

export default RenderTask;
