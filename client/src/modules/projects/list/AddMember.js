import React, { useState, useContext } from 'react';
import { Form, FormGroup, Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from 'reactstrap';
import { Context } from '../core/contexts';
import { useToasts } from 'react-toast-notifications';
import { UserSelector } from '..';

export default function AddMember(props) {
	const { _id, is_system, members } = props.data;
	const { addToast } = useToasts();
	const [teamMembers, setTeamMembers] = useState(members);
	const { update } = useContext(Context);

	const handleMembersSelect = members => {
		setTeamMembers(members);
	};

	return (
		<>
			<Modal isOpen={props.open} className={props.className || ''} size={props.size ? props.size : ''}>
				<Form
					onSubmit={e => {
						e.preventDefault();
						let payload = {
							members: teamMembers
						};
						if (is_system) {
							addToast('You cannot assign members to system projects', {
								appearance: 'error',
								autoDismiss: true
							});
							props.toggle();
							return;
						}
						update(_id, payload)
							.then(d => {
								addToast('Project Members Updated successfully', {
									appearance: 'success',
									autoDismiss: true
								});
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
									<UserSelector
										users={teamMembers}
										onChange={handleMembersSelect}
										disabled={is_system ? true : false}
									/>
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
