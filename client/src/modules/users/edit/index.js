import React from 'react';
import { RoleContextProvider } from '../../../contexts/RoleContext';
import EditUser from './EditUser';

function index(props) {
	return (
		<RoleContextProvider>
			<EditUser id={props.match.params.id} />
		</RoleContextProvider>
	);
}

export default index;
