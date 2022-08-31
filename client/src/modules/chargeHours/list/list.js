import React, { useState, useEffect } from 'react';
import RenderChargeSheet from '../RenderChargeSheet';
import { ButtonDropdown, DropdownToggle, Row, Col, DropdownItem, DropdownMenu } from 'reactstrap';
import AddChargeHours from './AddChargeHours';

function List({ props }) {
	const { list, members, reFetch } = props;
	const [dropdownOpen, setOpen] = useState([]);
	const [modalOpen, setModalOpen] = useState(false);
	const [assignTo, setAssignTo] = useState(null);

	const toggle = indx => setOpen(prev => prev.map((item, index) => (index === indx ? !item : item)));

	const getTotalHours = id => {
		const hours = list
			?.filter(d => d.created_by === id)
			.map(c => c.hours)
			.reduce((a, b) => a + b, 0);
		return hours;
	};

	useEffect(() => {
		if (!members || !members.length) return;
		setOpen(members.map(itm => false));
	}, [members]);

	return (
		<>
			{members?.length
				? members.map((member, index) => (
						<Row key={index} className=" pt-2 pb-2 border-bottom">
							<Col md="2">
								<Row>
									<Col xs={12}>
										<ButtonDropdown isOpen={dropdownOpen[index]} toggle={() => toggle(index)}>
											<DropdownToggle
												title={
													getTotalHours(member._id) < 40
														? 'Member is yet to log 40 charge hrs.'
														: 'Member has logged 40 hrs per week'
												}
												style={{
													width: '150px',
													overflow: 'hidden',
													backgroundColor: getTotalHours(member._id) < 40 ? 'rgb(204, 0, 0)' : 'rgb(26, 179, 147)',
													border: 'none',
													padding: '0.2rem'
												}}
												size="sm"
												caret
											>
												{member.name}
											</DropdownToggle>
											<DropdownMenu>
												<DropdownItem
													onClick={() => {
														setAssignTo(member._id);
														setModalOpen(true);
													}}
												>
													Assign Hours
												</DropdownItem>
											</DropdownMenu>
										</ButtonDropdown>
									</Col>
									<Col xs={12} className="m-2">
										Total: {getTotalHours(member._id)}
										/40 hrs
									</Col>
								</Row>
							</Col>

							<Col md="10">
								{list?.length && list.filter(d => d.created_by === member._id).length ? (
									<div>
										<RenderChargeSheet sheets={list.filter(d => d.created_by === member._id)} reFetch={reFetch} />
									</div>
								) : (
									''
								)}
							</Col>
						</Row>
				  ))
				: ''}
			<AddChargeHours
				title="Assign Charge Hours"
				open={modalOpen}
				setOpen={v => setModalOpen(v)}
				assignTo={assignTo}
				reFetch={reFetch}
			/>
		</>
	);
}

export default List;
