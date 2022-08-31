import React from 'react';
import LeaveList from './LeaveList';
import { LeaveContextProvider } from '../../../contexts/LeaveContext';
function index() {
	return (
		<LeaveContextProvider>
			<LeaveList />
		</LeaveContextProvider>
	);
}

export default index;
