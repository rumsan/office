import React from 'react';
import MyLeave from './MyLeave';
import { LeaveContextProvider } from '../../../contexts/LeaveContext';
function index() {
	return (
		<LeaveContextProvider>
			<MyLeave />
		</LeaveContextProvider>
	);
}

export default index;
