import * as ACTIONS from '../actions/roles';

export default (state, action) => {
	const result = action.data;
	switch (action.type) {
		case ACTIONS.LIST_ROLES:
			return {
				...state,
				list: result.data
			};

		default:
			return state;
	}
};
