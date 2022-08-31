import * as ACTIONS from '../actions/dailyTask';

export default (state, action) => {
	const result = action.data;

	switch (action.type) {
		case ACTIONS.GET_MY_DAILY_TASKS:
			return {
				...state,
				daily_tasks: result
				// pagination: {
				// 	total: parseInt(result.total),
				// 	limit: parseInt(result.limit),
				// 	start: parseInt(result.start),
				// 	currentPage: parseInt(result.page),
				// 	totalPages: Math.ceil(result.total / result.limit)
				// }
			};

		default:
			return state;
	}
};
