import React, { useState, useEffect, useContext } from 'react';
import ReactSelect from '../../global/ReactSelect';
import { TaskManagerContext } from '../../../contexts/TaskManagerContext';

import { useToasts } from 'react-toast-notifications';
import * as SOURCE from '../../../constants/taskSource';
import { Label } from 'reactstrap';
import LoadingSpinner from '../../global/Spinner';
import CreatableReactSelect from '../../global/CreatableReactSelect';
import PropTypes from 'prop-types';
function TaskMapper({ props }) {
	const { task, setTask, source, assigned_by, assigned_to } = props;

	const { addToast } = useToasts();

	const {
		gitlab,
		meistertask,
		meisterTaskProject,
		gitlabProject,
		getMeisterTaskProjects,
		getGitlabGroups,
		getGitlabGroupsProjects,
		getMeisterTaskGroupProjects,
		getGitlabProjectTasks,
		getMeisterTaskProjectTasks,
		tasks
	} = useContext(TaskManagerContext);

	const [groupOptions, setGroupOptions] = useState([]);
	const [projectOptions, setProjectOptions] = useState([]);
	const [isGroupLoading, setGroupLoading] = useState(false);
	const [isProjectOptionsLoading, setProjectOptionsLoading] = useState(false);
	const [isTaskOptionsLoading, setTaskOptionsLoading] = useState(false);

	const [selectedGroup, setSelectedGroup] = useState(null);
	const [selectedProjectOptions, setSelectedProjectOption] = useState({});
	const [taskOptions, setProjectTaskOptions] = useState([]);
	const [selectedTaskOption, setSelectedtaskOption] = useState(null);
	function resetAll() {
		setTask({});
		setSelectedtaskOption(null);
		setProjectTaskOptions([]);
		setSelectedProjectOption({});
		setSelectedGroup(null);
		setProjectOptions([]);
		setProjectOptionsLoading(false);
		setTaskOptionsLoading(false);
	}
	function selectTask(arg) {
		if (!arg) {
			const { isNew, name, ...remTask } = task;
			const { taskId, url, ...rest } = task.sourceData;
			setTask({
				...remTask,
				assigned_by,
				assigned_to,
				status: 'open',
				sourceData: rest
			});
			return;
		}
		const { value: id, label, isNew } = arg;

		if (source === SOURCE.GITLAB) {
			if (isNew) {
				setTask({
					...task,
					assigned_by,
					assigned_to,
					status: 'open',
					source,
					isNew,
					name: label,
					sourceData: {
						...task.sourceData,
						taskId: isNew ? null : id
					}
				});
				return;
			}
			const { web_url, title } = tasks.find(item => item.iid === id);

			setTask({
				...task,
				assigned_by,
				assigned_to,
				status: 'open',
				source,
				isNew: isNew ? true : false,
				name: isNew ? label : title,
				sourceData: {
					...task.sourceData,
					taskId: isNew ? null : id,
					url: web_url
				}
			});
			return;
		} else {
			if (isNew) {
				setTask({
					...task,
					source,
					isNew,
					name: label,
					assigned_by,
					assigned_to,
					status: 'open',
					sourceData: {
						...task.sourceData,
						taskId: isNew ? null : id
					}
				});
				return;
			}
			const { token, name } = tasks.find(item => item.id === id);

			setTask({
				...task,
				source,
				isNew,
				name,
				assigned_by,
				assigned_to,
				status: 'open',
				sourceData: {
					...task.sourceData,
					taskId: isNew ? null : id,
					url: `https://www.meistertask.com/app/task/${token}`
				}
			});
			return;
		}
	}
	function setSourceProjectOptions() {
		if (!gitlab && !meistertask) return;
		if (gitlab) {
			let options = gitlab.map((item, index) => {
				return { value: item.id, label: item.name };
			});
			setGroupOptions(options);
			return;
		}
		if (meistertask) {
			let options = meistertask.map((item, index) => {
				return { value: item.id, label: item.name };
			});
			setGroupOptions(options);
		}
	}
	function selectProjectOption(args) {
		const { value: id, label } = args;
		if (source === SOURCE.GITLAB) {
			const { path_with_namespace } = gitlabProject.find(item => item.id === id);

			setTask({
				...task,
				sourceData: {
					...task.sourceData,
					projectId: id,
					projectName: label,
					projectPath: path_with_namespace.replace('/', ' > ')
				}
			});
		} else {
			setTask({
				...task,
				sourceData: {
					...task.sourceData,
					sectionId: id,
					projectName: label,
					projectPath: `${selectedGroup.label} > ${label}`
				}
			});
		}
		setSelectedProjectOption({ id, label });
	}
	function selectGroup(args) {
		const { value: id, label } = args;

		if (source === SOURCE.GITLAB) {
			setTask({
				...task,
				sourceData: {
					groupId: id
				}
			});
		} else {
			setTask({ ...task, sourceData: { projectId: id } });
		}
		setSelectedGroup({ id, label });
	}

	function fetchProjects() {
		if (!selectedGroup) return;
		setProjectOptions([]);
		setProjectTaskOptions([]);
		setSelectedtaskOption(null);
		setProjectOptionsLoading(true);

		if (source === SOURCE.GITLAB) {
			getGitlabGroupsProjects(selectedGroup.id)
				.then(() => {
					setProjectOptionsLoading(false);
				})
				.catch(err => {
					addToast('Something went wrong', { appearance: 'error', autoDismiss: true });
				});
			return;
		}
		if (source === SOURCE.MEISTERTASK) {
			getMeisterTaskGroupProjects(selectedGroup.id)
				.then(() => {
					setProjectOptionsLoading(false);
				})
				.catch(err => {
					addToast('Something went wrong', { appearance: 'error', autoDismiss: true });
				});
			return;
		}
	}
	function fetchMeisterProjects() {
		setGroupLoading(true);
		getMeisterTaskProjects()
			.then(() => {
				setGroupLoading(false);
			})
			.catch(err => {
				addToast('Something went wrong when fetching meistertask projects', { appearance: 'error', autoDismiss: true });
			});
	}

	function fetchGitlabGroups() {
		setGroupLoading(true);

		getGitlabGroups()
			.then(() => {
				setGroupLoading(false);
			})
			.catch(err => {
				addToast('Something went wrong when fetching gitlab groups', { appearance: 'error', autoDismiss: true });
			});
	}

	function fetchGroup() {
		if (!source) return;
		resetAll();
		if (source === SOURCE.MEISTERTASK) fetchMeisterProjects();
		if (source === SOURCE.GITLAB) fetchGitlabGroups();
	}

	function setGroupProjectOptions() {
		if (!meisterTaskProject && !gitlabProject) return;

		if (gitlabProject) {
			let options = gitlabProject.map((item, index) => {
				return {
					value: item.id,
					label: item.name
				};
			});
			setProjectOptions(options);
		}
		if (meisterTaskProject) {
			let options = meisterTaskProject.map((item, index) => {
				return {
					value: item.id,
					label: item.name
				};
			});
			setProjectOptions(options);
		}
	}
	function fetchProjectTasks() {
		if (!Object.keys(selectedProjectOptions).length > 0) return;
		setProjectTaskOptions([]);
		setTaskOptionsLoading(true);
		if (source === SOURCE.MEISTERTASK) {
			getMeisterTaskProjectTasks(selectedProjectOptions.id)
				.then(() => {
					setTaskOptionsLoading(false);
				})
				.catch(err => {
					addToast('Something went wrong', { appearance: 'error', autoDismiss: true });
				});
			return;
		}
		if (source === SOURCE.GITLAB) {
			getGitlabProjectTasks(selectedProjectOptions.id)
				.then(() => {
					setTaskOptionsLoading(false);
				})
				.catch(err => {
					addToast('Something went wrong', { appearance: 'error', autoDismiss: true });
				});
			return;
		}
	}

	function setTaskOptions() {
		if (!tasks) return;
		setProjectTaskOptions([]);
		let taskOpts = tasks.map((item, index) => {
			return {
				value: source === SOURCE.MEISTERTASK ? item.id : item.iid,
				label: source === SOURCE.MEISTERTASK ? item.name : item.title
			};
		});
		setProjectTaskOptions(taskOpts);
	}

	function setForm() {
		if (!selectedTaskOption) return;

		if (source === SOURCE.GITLAB) {
			setTask({
				groupId: selectedGroup,
				projectId: selectedProjectOptions,
				task: selectedTaskOption
			});
			return;
		}
		if (source === SOURCE.MEISTERTASK) {
			setTask({
				sectionId: selectedProjectOptions,
				projectId: selectedGroup,
				task: selectedTaskOption
			});
		}
	}

	useEffect(setForm, [selectedTaskOption]);

	useEffect(setTaskOptions, [tasks]);

	useEffect(fetchProjectTasks, [selectedProjectOptions]);

	useEffect(setGroupProjectOptions, [meisterTaskProject, gitlabProject]);

	useEffect(fetchProjects, [selectedGroup]);

	useEffect(setSourceProjectOptions, [gitlab, meistertask]);

	useEffect(fetchGroup, [source]);
	return (
		<>
			<div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gridColumnGap: '10px' }}>
				<div>
					<Label>Choose a Groups : </Label>
					{isGroupLoading ? (
						<LoadingSpinner numberOfSpinners={1} />
					) : (
						<ReactSelect options={groupOptions} onSelect={selectGroup} />
					)}
				</div>
				<div>
					{projectOptions && projectOptions.length ? (
						<>
							<Label>Choose a Projects :</Label>
							<ReactSelect options={projectOptions} onSelect={selectProjectOption} />
						</>
					) : isProjectOptionsLoading ? (
						<>
							<Label>Loading Projects :</Label>

							<LoadingSpinner numberOfSpinners={1} />
						</>
					) : (
						''
					)}
				</div>
			</div>
			<br />
			<div>
				{!isTaskOptionsLoading &&
				projectOptions &&
				projectOptions.length &&
				Object.keys(selectedProjectOptions).length ? (
					<>
						<Label>Choose a Task :</Label>
						<CreatableReactSelect
							options={taskOptions}
							onSelect={selectTask}
							placeholder={'Select tasks or create your own task'}
						/>
					</>
				) : isTaskOptionsLoading ? (
					<LoadingSpinner numberOfSpinners={1} />
				) : (
					''
				)}
			</div>
		</>
	);
}
TaskMapper.prototype = {
	source: PropTypes.string.isRequired,
	task: PropTypes.object.isRequired,
	setTask: PropTypes.func.isRequired,
	assigned_by: PropTypes.string.isRequired,
	assigned_to: PropTypes.string.isRequired
};
export default TaskMapper;
