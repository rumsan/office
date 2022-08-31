import React from 'react';
import Select from 'react-select';

export function ReactSelect(props) {
	const { placeholder, value, optionList, required, multiple, handleSelection } = props;

	const handleSelected = e => {
		handleSelection(e);
	};

	return (
		<Select
			placeholder={placeholder || 'Select'}
			value={value || ''}
			options={optionList}
			onChange={e => handleSelected(e)}
			required={required || false}
			isMulti={multiple || false}
		></Select>
	);
}
