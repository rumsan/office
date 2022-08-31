import * as ACTIONS from '../actions/leave';

export default (state, action) => {
	const result = action.data;
	switch (action.type) {
		case ACTIONS.LIST_LEAVE_REQUEST: {
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
		}

		default:
			return state;
	}
};
