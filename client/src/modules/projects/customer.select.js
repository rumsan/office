import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { getAllCustomers, getAllEntities } from './customer.services';

const groupStyles = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between'
};

const groupBadgeStyles = {
	backgroundColor: '#EBECF0',
	borderRadius: '2em',
	color: '#172B4D',
	display: 'inline-block',
	fontSize: 12,
	fontWeight: 'normal',
	lineHeight: '1',
	minWidth: 1,
	padding: '0.16666666666667em 0.5em',
	textAlign: 'center'
};

export default function ({ customer, onChange, disabled }) {
	const [external, setExternal] = useState([]);
	const [internal, setInternal] = useState([]);
	const [prevVal, setUpdatedVal] = useState({});

	const updateVal = e => {
		if (e) {
			setUpdatedVal({ ...e });
			onChange({ id: e.value, name: e.label });
		}
	};

	const groupedOptions = [
		{
			label: 'Internal Clients',
			options: internal
		},
		{
			label: 'External Clients',
			options: external
		}
	];

	const formatGroupLabel = data => (
		<div style={groupStyles}>
			<span>{data.label}</span>
			<span style={groupBadgeStyles}>{data.options.length}</span>
		</div>
	);

	useEffect(() => {
		async function fetchData() {
			if (customer) {
				setUpdatedVal(customer && customer.id ? { label: customer.name, value: customer.id } : '');
				const cusRes = await getAllCustomers();
				let formattedCustomerList = cusRes && cusRes.data.length > 0 ? cusRes.data : [];
				formattedCustomerList = formattedCustomerList.map(data => {
					return { label: data.name, value: data._id };
				});
				const entRes = await getAllEntities();
				let formattedEntitiesList = entRes && entRes.data.length > 0 ? entRes.data : [];
				formattedEntitiesList = formattedEntitiesList.map(data => {
					return { label: data.name, value: data._id };
				});
				setExternal(formattedCustomerList);
				setInternal(formattedEntitiesList);
			}
		}
		fetchData();
	}, [customer]);

	return (
		<div className="form-item">
			<label htmlFor="name">Customer</label>
			<Select
				options={groupedOptions}
				isDisabled={disabled}
				value={prevVal}
				onChange={e => updateVal(e)}
				placeholder={<div>Select Customer internal or external...</div>}
				formatGroupLabel={formatGroupLabel}
			/>
		</div>
	);
}
