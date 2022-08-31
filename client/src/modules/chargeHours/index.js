import React from 'react';
import { ChargeHoursContextProvider } from '../../contexts/ChargeHoursContext';

import ChargeHours from './ChargeHours';

function index() {
	return (
		<ChargeHoursContextProvider>
			<ChargeHours />
		</ChargeHoursContextProvider>
	);
}

export default index;
