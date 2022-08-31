import React, { useEffect, useState } from 'react';
import Select from 'react-select';

import { list } from './core/services';

export default function ({ project, user, onChange, disabled }) {
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
			if (project || user) {
				setUpdatedVal(project && project.id ? { label: project.name, value: project.id } : '');
				const res = await list({ limit: 1000, member: user });
				let formattedProjectList = res && res.data.length > 0 ? res.data : [];
				formattedProjectList = formattedProjectList.map(data => {
					return { label: `${data.name} (${data.entity.name})`, value: data._id };
				});
				setList(formattedProjectList);
			}
		}
		fetchData();
	}, [project, user]);

	return (
		<div className="form-item">
			<label htmlFor="name">Project</label>
			<Select
				isClearable
				isDisabled={disabled}
				options={List}
				value={prevVal}
				onChange={e => updateVal(e)}
				placeholder={<div>Select your Project...</div>}
			/>
		</div>
	);
}

/* 
Use it like this:
<ProjectSelector project={project} user={'5e9d2d6b1e26073929e27784'} onChange={e => console.log(e)} />
*/
