import React, { createContext, useReducer } from 'react';
import taskManagerReduce from '../reducers/taskManagerReducer';
import * as Service from '../services/taskManagers';
import * as ACTIONS from '../actions/taskManager';

const initialState = {
	gitlab: null,
	meistertask: null,
	gitlabProject: null,
	meisterTaskProject: null,
	tasks: null
};

export const TaskManagerContext = createContext(initialState);
export const TaskManagerContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(taskManagerReduce, initialState);

	async function getMeisterTaskProjects() {
		const res = await Service.getMeisterProjects();
		dispatch({ type: ACTIONS.GET_MEISTERTASK_GROUPS, data: res });
		return;
	}
	async function getGitlabGroups() {
		const res = await Service.getGitlabGroups();
		dispatch({ type: ACTIONS.GET_GITLAB_GROUPS, data: res });
		return;
	}
	async function getGitlabGroupsProjects(id) {
		const res = await Service.getGitlabGroupsProjects(id);
		dispatch({ type: ACTIONS.GET_GITLAB_GROUP_PROJECTS, data: res });
		return;
	}
	async function getMeisterTaskGroupProjects(id) {
		const res = await Service.getMeisterTaskGroupProjects(id);
		dispatch({ type: ACTIONS.GET_MEISTERTASK_GROUPS_PROJECT, data: res });
		return;
	}
	async function getGitlabProjectTasks(id) {
		const res = await Service.getGitlabProjectTasks(id);
		dispatch({ type: ACTIONS.GET_GITLAB_PROJECTS_TASKS, data: res });
		return;
	}
	async function getMeisterTaskProjectTasks(id) {
		const res = await Service.getMeisterTaskProjectTasks(id);
		dispatch({ type: ACTIONS.GET_MEISTERTASK_PROJECT_TASKS, data: res });
		return;
	}
	return (
		<TaskManagerContext.Provider
			value={{
				gitlab: state.gitlab,
				meistertask: state.meistertask,
				meisterTaskProject: state.meisterTaskProject,
				gitlabProject: state.gitlabProject,
				tasks: state.tasks,
				getMeisterTaskProjects,
				getGitlabGroups,
				getGitlabGroupsProjects,
				getMeisterTaskGroupProjects,
				getGitlabProjectTasks,
				getMeisterTaskProjectTasks
			}}
		>
			{children}
		</TaskManagerContext.Provider>
	);
};
