import React from 'react';
import { Form, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup } from 'reactstrap';
import PropTypes from 'prop-types';

export default function CustomModal(props) {
	const handleClose = () => {
		props.handleCancel();
		props.setOpen(false);
	};

	return (
		<>
			<Modal isOpen={props.open} size={props.size ? props.size : ''}>
				<Form id="form" onSubmit={props.handleSubmit}>
					<ModalHeader>{props.title || 'Modal Title'}</ModalHeader>
					<ModalBody>{props.children || 'No child elements supplied.'}</ModalBody>
					<ModalFooter>
						<FormGroup>
							{props.handleCancel ? (
								<Button onClick={handleClose} className="mr-2">
									Close
								</Button>
							) : (
								<Button color="secondary" onClick={() => props.setOpen(!props.open)}>
									Close
								</Button>
							)}
							{props.handleSubmit ? (
								<Button color="primary" type="submit" style={{ marginLeft: 5 }}>
									Submit
								</Button>
							) : (
								''
							)}
						</FormGroup>
					</ModalFooter>
				</Form>
			</Modal>
		</>
	);
}

CustomModal.propTypes = {
	open: PropTypes.bool.isRequired,
	setOpen: PropTypes.func.isRequired
};
