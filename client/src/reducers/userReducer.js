import * as ACTIONS from '../actions/user';

export default (state, action) => {
	const result = action.data;

	switch (action.type) {
		case ACTIONS.ADD_USER: {
			return {
				...state,
				list: [...state.list, result]
			};
		}
		case ACTIONS.CHANGE_USER_STATUS: {
			return {
				...state,
				list: state.list.map((item, index) => (item._id === result._id ? result : item))
			};
		}
		case ACTIONS.GET_USER_DETAILS:
			return {
				...state,
				user_info: action.data
			};

		case ACTIONS.LIST_ALL_USERS:
			return {
				...state,
				list: result.data,
				pagination: {
					total: parseInt(result.total),
					limit: parseInt(result.limit),
					start: parseInt(result.start),
					currentPage: parseInt(result.page),
					totalPages: Math.ceil(result.total / result.limit)
				}
			};
		default:
			return state;
	}
};
