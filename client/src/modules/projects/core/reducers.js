import ACTION from './actions';

export default (state, action) => {
	const result = action.res;
	switch (action.type) {
		case `${ACTION.LIST_SUCCESS}`:
			return {
				...state,
				data: result.data,
				pagination: {
					total: parseInt(result.total),
					limit: parseInt(result.limit),
					start: parseInt(result.start),
					currentPage: parseInt(result.page),
					totalPages: Math.ceil(result.total / result.limit)
				}
			};
		case `${ACTION.GET_SUCCESS}`:
			return {
				...state,
				details: action.res.data
			};

		case `${ACTION.SET_LOADING}`:
			return {
				...state,
				loading: true
			};

		case `${ACTION.RESET_LOADING}`:
			return {
				...state,
				loading: false
			};

		case `${ACTION.DELETE_SUCCESS}`:
			return {
				...state,
				loading: false
			};
		default:
			return state;
	}
};
