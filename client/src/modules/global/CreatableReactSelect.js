import React, { useState, useEffect } from 'react';
import CreatableSelect from 'react-select/creatable';

function CreatableReactSelect({ options, onSelect, placeholder }) {
	const [defaultOptions, setDefOptions] = useState([]);
	const [value, setValue] = useState(null);

	const createOption = label => ({
		label,
		value: label.toLowerCase().replace(/\W/g, ''),
		isNew: true
	});

	function changeValue(e) {
		onSelect(e);
		setValue(e);
	}
	function setDefaultOptions() {
		if (!options || !options.length) {
			setValue(null);
			setDefOptions([]);
			return;
		}
		setValue(null);
		setDefOptions(options);
	}
	function handleCreateNewTask(e) {
		const newOption = createOption(e);
		setDefOptions([...defaultOptions, newOption]);
		setValue(newOption);
		onSelect(newOption);
	}

	useEffect(setDefaultOptions, [options]);

	return (
		<CreatableSelect
			isClearable
			allowCreate={true}
			value={value ? value : ''}
			options={defaultOptions}
			onChange={e => changeValue(e)}
			onCreateOption={e => handleCreateNewTask(e)}
			placeholder={placeholder ? placeholder : ''}
		/>
	);
}

export default CreatableReactSelect;
