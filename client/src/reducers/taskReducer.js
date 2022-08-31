import * as ACTIONS from '../actions/task';
export default (state, action) => {
	const result = action.data;

	switch (action.type) {
		case ACTIONS.GET_OUTSTANDING_TASK:
			return {
				...state,
				tasks: result.data,
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
