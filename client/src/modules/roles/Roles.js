import React, { useState } from 'react';
import { ReactSelect } from '../../utils/reactSelect';
import { Button, Row, Card, CardBody, CardTitle, Col, Input, Table } from 'reactstrap';
import CustomModal from '../global/CustomModal';

function Roles() {
	const [modal, setModal] = useState(false);

	const handleAddRole = () => {
		setModal(!modal);
	};
	return (
		<>
			<Row>
				<Col md="6">
					<Card style={{ paddingTop: '0px', minHeight: '465px' }}>
						<CardTitle style={{ margin: '15px' }}>
							<i className="fa fa-sitemap"></i>&nbsp; Available Roles
							<br />
							<small>Please select a role to display available permissions.</small>
						</CardTitle>
						<CardBody>
							<Button
								style={{ float: 'right', color: 'white' }}
								color="success"
								size="sm"
								onClick={() => handleAddRole()}
							>
								<i className="fa fa-plus"></i>&nbsp;Add Role
							</Button>
							<Table className="no-wrap v-middle" striped hover bordered responsive style={{ overflow: 'hidden' }}>
								<thead>
									<tr className="border-0">
										<th className="border-0">Name</th>
										<th className="border-0">Is System</th>
										<th className="border-0">Action</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td colSpan={7}>No data available.</td>
									</tr>
								</tbody>
							</Table>
						</CardBody>
					</Card>
				</Col>
				<Col md="6">
					{/* {showDetails && role_details ? ( */}
					<>
						<Card>
							<CardTitle style={{ margin: '15px', fontWeight: 'lighter' }}>
								<i className="fa fa-key"></i>&nbsp; Permissions for{' '}
								<span style={{ borderBottom: '1px dashed #999' }}>Role detail Name</span>
								{/* <span style={{ borderBottom: '1px dashed #999' }}>{role_details.name}</span> */}
							</CardTitle>

							<br />
							<Row className="p-2">
								<Col md="10">
									<ReactSelect
										placeholder="Select permissions to add"
										// value={detailsPermissions}
										// optionList={filteredPermissions}
										// handleSelection={perms => setDetailsPermissions(perms)}
										required="true"
										multiple="true"
									></ReactSelect>
								</Col>
								<Col md="2">
									<Button
										style={{ color: 'white' }}
										color="success"
										// onClick={() => updateSelectedRole(role_details.name)}
									>
										Add
									</Button>
								</Col>
							</Row>
							<CardBody>
								<Table className="no-wrap v-middle" striped hover bordered responsive style={{ overflow: 'hidden' }}>
									<thead>
										<tr className="border-0">
											<th className="border-0">Name</th>
											<th className="border-0">Action</th>
										</tr>
									</thead>
									<tbody>
										{/* {role_details.permissions.length ? (
												role_details.permissions.map(d => {
													return (
														<tr key={d}>
															<td>{d}</td>
															<td className="blue-grey-text text-darken-4 font-medium text-center">
																{role_details.is_system ? (
																	''
																) : (
																	<Button
																		className="btn btn-danger"
																		size="sm"
																		onClick={() => removePermission(role_details._id, d)}
																	>
																		<i className="fa fa-trash"></i>
																	</Button>
																)}
															</td>
														</tr>
													);
												})
											) : (
												<tr>
													<td colSpan={7}>No data available.</td>
												</tr>
											)} */}
										<tr>
											<td colSpan={7}>No data available.</td>
										</tr>
									</tbody>
								</Table>
							</CardBody>
						</Card>
					</>
					{/* ) : null} */}
				</Col>
			</Row>
			<CustomModal open={modal} setOpen={handleAddRole} title="Add New Role" size="lg">
				<Row>
					<Col md="6">
						<div className="form-item">
							<label htmlFor="name">Role</label>
							<br />
							<Input type="text" name="name" className="form-field" required />
						</div>
					</Col>
					<Col md="12">
						<div className="form-item">
							<label htmlFor="permissions">Permissions</label>
							<br />
							<ReactSelect
								placeholder="Select Permissions to add"
								// value={permissions}
								// optionList={permissionList}
								// handleSelection={perms => setPermissions(perms)}
								required="true"
								multiple="true"
							></ReactSelect>
						</div>
					</Col>
				</Row>
			</CustomModal>
		</>
	);
}

export default Roles;
