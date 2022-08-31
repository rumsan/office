import React, { useState, useEffect } from 'react';

import Select from 'react-select';

function ReactSelect(props) {
	const { options, onSelect, defValue, required, multiple } = props;
	const [value, setValue] = useState(null);

	function changeValue(e) {
		onSelect(e);
		setValue(e);
	}

	useEffect(() => {
		if (!options) {
			setValue(null);

			return;
		}
		if (!defValue) return;

		setValue(options.filter(item => item.value === defValue));
	}, [options, defValue]);

	return (
		<Select
			name="group"
			width={props.width ? props.width : ''}
			options={options}
			onChange={e => changeValue(e)}
			value={value ? value : ''}
			required={required || false}
			multiple={multiple || false}
			isDisabled={options.length ? false : true}
		/>
	);
}

export default ReactSelect;
