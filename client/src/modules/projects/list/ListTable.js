import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import { Row, Col, Card, CardTitle, CardBody, Input, Table, CustomInput, Button } from 'reactstrap';
import { Context } from '../core/contexts';
import Paginate from '../../global/Paginate';
import { nameFormatter, dateFormatter } from '../../../utils';
import AddModal from './AddModal';
import AddMember from './AddMember';
import { getUserTeamName } from '../../../utils/sessionManager';

import { getAllEntities } from '../customer.services';

const defaultFilter = {
	isCustomer: 'false',
	is_archived: 'ongoing',
	searchTeam: '',
	search: ''
};

const List = () => {
	const { addToast } = useToasts();
	const [current, setCurrent] = useState(0);
	const [modal, setModal] = useState(false);
	const { data, list, pagination } = useContext(Context);
	const [entities, setEntities] = useState([]);
	const [filter, setFilter] = useState(defaultFilter);

	const [selectedProject, setSelectedProject] = useState(null);
	const [addMemberModal, setAddMemberModal] = useState(false);

	const toggle = () => {
		setModal(!modal);
	};

	const toggleAddMemberModal = () => {
		setAddMemberModal(!addMemberModal);
	};

	const handleAddMember = project => {
		setSelectedProject(project);
		toggleAddMemberModal();
	};

	const fetchList = query => {
		let params = { ...pagination, ...query, ...filter };
		params.team = getUserTeamName();
		if (params.is_archived === 'all') delete params.team;
		list(params)
			.then()
			.catch(() => {
				addToast('Internal server error!', {
					appearance: 'error',
					autoDismiss: true
				});
			});
	};

	const handlePagination = current_page => {
		let _start = current_page * pagination.limit;
		setCurrent(current_page);
		const query = { ...filter };
		return loadList({
			start: _start,
			limit: pagination.limit,
			...query
		});
	};

	const handleSearchInputChange = e => {
		const { value } = e.target;
		setFilter({ ...filter, search: value });
	};

	const handleArchiveChange = e => {
		const value = e.target.value;
		setFilter({ ...filter, is_archived: value });
	};

	const handleFilterAsCustomer = e => {
		const value = e.target.value;
		setFilter({ ...filter, isCustomer: value });
	};

	const loadList = query => {
		if (!query) query = null;
		list(query)
			.then()
			.catch(() => {
				addToast('Something went wrong!', {
					appearance: 'error',
					autoDismiss: true
				});
			});
	};

	const handleTeamChange = e => {
		let { value } = e.target;
		setFilter({ ...filter, searchTeam: value });
	};

	const clearFilter = () => {
		setFilter(defaultFilter);
	};

	useEffect(fetchList, [filter]);
	useEffect(() => {
		async function fetchEntites() {
			const res = await getAllEntities();
			let formattedEntitiesList = res && res.data.length > 0 ? res.data : [];
			formattedEntitiesList = formattedEntitiesList.filter(
				entity => entity.type === 'business' && entity.is_archived === false
			);
			formattedEntitiesList = formattedEntitiesList.map(data => {
				return { label: data.name, value: data._id };
			});
			setEntities(formattedEntitiesList);
		}
		fetchEntites();
	}, []);
	return (
		<>
			<Card>
				<CardTitle className="mb-0 p-3 border-bottom bg-light">
					<Row>
						<Col md="2">
							<i className="mdi mdi-border-right mr-2"></i>Projects
						</Col>
						<Col md="10" className="text-right">
							<CustomInput
								type="select"
								id="filterAsCustomerSelect"
								value={filter.isCustomer}
								style={{ width: 'auto' }}
								onChange={handleFilterAsCustomer}
							>
								<option value="false">Filter</option>
								<option value="true">As Customer</option>
							</CustomInput>
							<CustomInput
								type="select"
								id="serviceSelect"
								name="serviceSelect"
								value={filter.is_archived}
								style={{ width: 'auto' }}
								onChange={handleArchiveChange}
							>
								<option value="ongoing">Filter</option>
								<option value="completed">Completed</option>
								<option value="ongoing">On Going</option>
								<option value="all">All</option>
							</CustomInput>
							<CustomInput
								type="select"
								id="teamSelect"
								name="customSelect"
								value={filter.searchTeam}
								style={{ width: 'auto' }}
								onChange={handleTeamChange}
							>
								<option value="">Search By Team</option>
								{entities?.map((e, i) => {
									return (
										<option key={i} value={e.value}>
											{e.label}
										</option>
									);
								})}
							</CustomInput>
							<div style={{ display: 'inline-flex' }}>
								<Input
									placeholder="Search By Name/Customer"
									onChange={handleSearchInputChange}
									value={filter.search}
									style={{ width: '250px' }}
								/>
							</div>
							<Button color="danger" className="ml-1" onClick={clearFilter}>
								Clear
							</Button>
							<Button color="info" className="ml-2" onClick={toggle}>
								Add
							</Button>
						</Col>
					</Row>
				</CardTitle>
				<CardBody>
					<Table className="no-wrap v-middle" responsive>
						<thead>
							<tr className="border-0">
								<th className="border-0">Name</th>
								<th className="border-0">Team</th>
								<th className="border-0">Customer</th>
								<th className="border-0">Deadline</th>
								<th className="border-0">Total Budgeted Hours</th>
								<th className="border-0">Action</th>
							</tr>
						</thead>
						<tbody>
							{data.length ? (
								data.map(d => {
									return (
										<tr key={d._id}>
											<td>
												<div className="text-dark">{d && d.name ? nameFormatter(d.name) : '-'}</div>
											</td>
											<td>{d && d.entity && d.entity.name ? nameFormatter(d.entity.name) : '-'}</td>
											<td>{d && d.customer && d.customer.name ? nameFormatter(d.customer.name) : '-'}</td>
											<td>{d && d.deadline ? dateFormatter(d.deadline) : '-'}</td>
											<td>{d && d.budgeted_hours ? d.budgeted_hours : '-'}</td>
											<td>
												<Link
													className="btn btn-secondary btn-sm"
													to={`/projects/${d._id}`}
													title="View Project Details"
												>
													<i className="fa fa-eye"></i>
												</Link>
												<Button
													type="button"
													size="sm"
													className="ml-2 btn-info"
													title="Add Project Members"
													onClick={e => handleAddMember(d)}
												>
													<i className="fa fa-plus"></i>
												</Button>
											</td>
										</tr>
									);
								})
							) : (
								<tr>
									<td colSpan={7}>No data available.</td>
								</tr>
							)}
						</tbody>
					</Table>
					<Paginate limit={pagination.limit} total={pagination.total} current={current} onChange={handlePagination} />
				</CardBody>
			</Card>
			<AddModal title={'Add New Project'} open={modal} toggle={toggle} size="lg" />
			{addMemberModal && (
				<AddMember
					title={'Assign Members'}
					open={addMemberModal}
					toggle={toggleAddMemberModal}
					size="md"
					data={selectedProject}
				/>
			)}
			<br />
		</>
	);
};

export default List;
