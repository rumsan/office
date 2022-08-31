import * as ACTIONS from '../actions/taskManager';

export default (state, action) => {
	const result = action.data;

	switch (action.type) {
		case ACTIONS.GET_GITLAB_GROUPS:
			return {
				gitlab: result,
				meistertask: null
			};

		case ACTIONS.GET_MEISTERTASK_GROUPS: {
			return {
				meistertask: result,
				gitlab: null
			};
		}
		case ACTIONS.GET_GITLAB_GROUP_PROJECTS: {
			return {
				...state,
				meisterTaskProject: null,
				gitlabProject: result
			};
		}
		case ACTIONS.GET_MEISTERTASK_GROUPS_PROJECT: {
			return {
				...state,
				gitlabProject: null,
				meisterTaskProject: result
			};
		}
		case ACTIONS.GET_GITLAB_PROJECTS_TASKS:
		case ACTIONS.GET_MEISTERTASK_PROJECT_TASKS: {
			return {
				...state,
				tasks: result
			};
		}

		default:
			return state;
	}
};
