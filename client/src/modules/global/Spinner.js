import React from 'react';
import { Spinner } from 'reactstrap';
import PropTypes from 'prop-types';
const LoadingSpinner = ({ numberOfSpinners }) => {
	const spinners = Array.from(Array(numberOfSpinners).keys());
	const colors = [
		{ color: 'primary' },
		{ color: 'secondary' },
		{ color: 'danger' },
		{ color: 'warning' },
		{ color: 'info' },
		{ color: 'light' },
		{ color: 'dark' }
	];

	return (
		<div>
			{spinners.map((item, index) => (
				<Spinner key={index} color={colors[item].color} />
			))}
		</div>
	);
};
LoadingSpinner.propTypes = {
	numberOfSpinners: PropTypes.number.isRequired
};
export default LoadingSpinner;
