import React, { useState, useEffect, useContext } from 'react';
import { Form, FormGroup, Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Input } from 'reactstrap';
import { Context } from '../core/contexts';
import { useToasts } from 'react-toast-notifications';
import { CustomerSelector, EntitySelector, UserSelector } from '..';
import { getUserIdOnly, getUserTeamName } from '../../../utils/sessionManager';
import * as SessionManager from '../../../utils/sessionManager';

export default function AddModal(props) {
	const { addToast } = useToasts();
	const team = SessionManager.getUserTeamName();
	const [customer, setCustomer] = useState({});
	const [entity, setEntity] = useState({ id: null, name: team });
	const [users, setUsers] = useState([]);
	const { list, add } = useContext(Context);

	const addMeAsProjectMember = () => {
		const currentUserId = getUserIdOnly();
		setUsers([currentUserId]);
	};

	useEffect(addMeAsProjectMember, []);

	return (
		<>
			<Modal isOpen={props.open} className={props.className || ''} size={props.size ? props.size : ''}>
				<Form
					onSubmit={e => {
						e.preventDefault();
						const formData = new FormData(e.target);
						let payload = {
							name: formData.get('name'),
							deadline: formData.get('deadline'),
							customer: customer,
							entity: entity,
							members: users
						};
						add(payload)
							.then(d => {
								addToast('New Project Added successfully', {
									appearance: 'success',
									autoDismiss: true
								});
								list({ team: getUserTeamName() });
								setCustomer({});
								addMeAsProjectMember();
								props.toggle();
							})
							.catch(err =>
								addToast(err.message, {
									appearance: 'error',
									autoDismiss: true
								})
							);
						e.target.reset();
					}}
				>
					<ModalHeader toggle={props.toggle}>
						<div>
							<h3>{props && props.title ? props.title : 'Add New'}</h3>
						</div>
					</ModalHeader>
					<ModalBody>
						<Row>
							<Col md="12">
								<FormGroup>
									<EntitySelector entity={entity} onChange={e => setEntity(e)} disabled={true} />
								</FormGroup>
							</Col>
							<Col md="12">
								<FormGroup>
									<label htmlFor="name">Name</label>
									<br />
									<Input name="name" type="text" className="form-field" />
								</FormGroup>
							</Col>
							<Col md="12">
								<FormGroup>
									<CustomerSelector customer={customer} onChange={e => setCustomer(e)} />
								</FormGroup>
							</Col>
							<Col md="12">
								<FormGroup>
									<label htmlFor="deadline">Deadline</label>
									<Input name="deadline" type="date" className="form-field" />
								</FormGroup>
							</Col>
							<Col md="12">
								<FormGroup>
									<UserSelector users={users} onChange={e => setUsers(e)} />
								</FormGroup>
							</Col>
						</Row>
					</ModalBody>
					<ModalFooter>
						<Button color="primary">Submit</Button>
						<Button color="secondary" onClick={props.toggle}>
							Cancel
						</Button>
					</ModalFooter>
				</Form>
			</Modal>
		</>
	);
}
