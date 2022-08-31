import React from 'react';
import { ChargeHoursContextProvider } from '../../../contexts/ChargeHoursContext';

import ProjectCharge from './projectCharge';

function index(props) {
	return (
		<ChargeHoursContextProvider>
			<ProjectCharge props={props} />
		</ChargeHoursContextProvider>
	);
}

export default index;
