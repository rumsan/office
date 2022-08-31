import * as ACTIONS from '../actions/notification';

export default (state, action) => {
	const result = action.res;

	switch (action.type) {
		case 'GET_APP':
			return {
				...state
			};
		case ACTIONS.GET_NOTIFICATIONS_LIST:
			return {
				...state,
				notificationList: result.data
			};

		case ACTIONS.FETCH_NEW_NOTIFICATIONS:
			return {
				...state,
				notificationList: action.data
			};

		default:
			return state;
	}
};
