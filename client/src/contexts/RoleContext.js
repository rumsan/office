import React, { useReducer, createContext } from 'react';
import * as ACTIONS from '../actions/roles';
import roleReduce from '../reducers/roleReducer';
import * as Service from '../services/roles';

const initialState = {
	list: []
};

export const RoleContext = createContext(initialState);
export const RoleContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(roleReduce, initialState);

	async function listRole(query) {
		const res = await Service.listRoles(query);
		dispatch({ type: ACTIONS.LIST_ROLES, data: res });
		return res.data;
	}
	return (
		<RoleContext.Provider
			value={{
				list: state.list,
				listRole
			}}
		>
			{children}
		</RoleContext.Provider>
	);
};
