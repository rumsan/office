import React, { useEffect, useState } from 'react';
import Select from 'react-select';

import { getAllEntities } from './customer.services';

export default function ({ entity, onChange, disabled }) {
	const [List, setList] = useState([]);
	const [prevVal, setUpdatedVal] = useState({});

	const updateVal = e => {
		if (e) {
			setUpdatedVal({ ...e });
			onChange({ id: e.value, name: e.label });
		}
	};

	useEffect(() => {
		async function fetchData() {
			if (entity) {
				const res = await getAllEntities();
				let formattedEntitiesList = res && res.data.length > 0 ? res.data : [];
				formattedEntitiesList = formattedEntitiesList.filter(
					entity => entity.type === 'business' && entity.is_archived === false
				);
				formattedEntitiesList = formattedEntitiesList.map(data => {
					return { label: data.name, value: data._id };
				});
				setList(formattedEntitiesList);
				if (!entity.id) {
					const selected = formattedEntitiesList.filter(d => d.label === entity.name);
					updateVal(selected[0]);
					return;
				}
				setUpdatedVal(entity && entity.id ? { label: entity.name, value: entity.id } : '');
			}
		}
		fetchData();
	}, [entity]);

	return (
		<div className="form-item">
			<label htmlFor="name">Team</label>
			<Select
				isClearable
				isDisabled={disabled}
				options={List}
				value={prevVal}
				onChange={e => updateVal(e)}
				placeholder={<div>Select your team...</div>}
			/>
		</div>
	);
}
