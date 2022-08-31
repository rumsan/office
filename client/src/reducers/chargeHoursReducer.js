import * as ACTIONS from '../actions/chargeHours';

export default (state, action) => {
	const result = action.res;

	switch (action.type) {
		case ACTIONS.GET_CHARGESHEET_LIST:
			return {
				...state,
				list: result.chargeSheets
			};

		default:
			return state;
	}
};
