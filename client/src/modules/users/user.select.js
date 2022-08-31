import React, { useEffect, useState } from 'react';
import Select from 'react-select/creatable';

import { listUsers } from '../../services/users';

export default function ({ users, onChange, disabled }) {
	const [List, setList] = useState([]);
	const [prevVal, setUpdatedVal] = useState([]);

	const updateVal = e => {
		if (e) {
			setUpdatedVal([...e]);
			const finalMembers = e.map(user => user.value);
			onChange(finalMembers);
		}
	};

	useEffect(() => {
		async function fetchData() {
			if (users) {
				const res = await listUsers({ limit: 100, is_active: true });
				let formattedUserList = res && res.data.length > 0 ? res.data : [];
				formattedUserList = formattedUserList.map(data => {
					return { label: data.name.first.concat(' ', data.name.last), value: data._id };
				});
				setList([...formattedUserList]);
				const formattedPrevUsersData = users.map(user => {
					const formattedUser = formattedUserList.filter(b => b.value === user);
					return formattedUser[0];
				});
				setUpdatedVal([...formattedPrevUsersData]);
			}
		}
		fetchData();
	}, [users]);

	return (
		<div className="form-item">
			<label htmlFor="name">Project Members</label>
			<Select
				isMulti
				isDisabled={disabled}
				options={List}
				value={prevVal}
				onChange={e => updateVal(e)}
				isValidNewOption={() => false}
				placeholder={<div>Select your members...</div>}
			/>
		</div>
	);
}
