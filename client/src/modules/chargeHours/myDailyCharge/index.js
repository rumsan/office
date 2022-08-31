import React from 'react';
import { ChargeHoursContextProvider } from '../../../contexts/ChargeHoursContext';

import MyDailyCharge from './myDailyCharge';

function index(props) {
	return (
		<ChargeHoursContextProvider>
			<MyDailyCharge props={props} />
		</ChargeHoursContextProvider>
	);
}

export default index;
