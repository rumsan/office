import React, { useState } from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from 'reactstrap';
import styled from 'styled-components';
import LoadingSpinner from '../../../global/Spinner';
function Task({ props }) {
	const {
		item,
		index,
		assigned,
		status,
		taskId,
		changeTaskStatus,
		addToDailyTask,
		removeFromDailyTask,
		statusChanging,
		archeiveTasks
	} = props;
	const [dropdownOpen, setOpen] = useState(false);
	const toggle = () => setOpen(!dropdownOpen);
	function addTask() {
		const payload = { task: item };
		addToDailyTask(payload);
	}

	return (
		<>
			{item && (
				<TaskDiv background={index && index % 2 === 0 ? 'light' : index === 0 ? 'light' : 'dark'}>
					<TaskOverView>
						<TaskTitle>{item.name}</TaskTitle>
						<TaskDetails>
							<p style={{ width: 'max-content', display: 'inline-flex' }}>
								<strong>Est. time :</strong> {Math.floor(item.est_time / 60) + ':' + (item.est_time % 60)}|
								<strong>{` ${item.source}`}</strong>
								{`> `}
								{item.sourceData.projectPath}
							</p>
						</TaskDetails>
					</TaskOverView>
					<ButtonGroup>
						{statusChanging ? (
							<div style={{ marginRight: '0.2rem', paddingBottom: '0.2rem' }}>
								<LoadingSpinner numberOfSpinners={1} />
							</div>
						) : status && status === 'complete' ? (
							<Button
								size="sm"
								color="success"
								className="mr-2"
								style={{ marginRight: '0.2rem', paddingBottom: '0.2rem' }}
								onClick={() => {
									changeTaskStatus(taskId, 'incomplete');
								}}
							>
								Completed
							</Button>
						) : status === 'incomplete' ? (
							<Button
								size="sm"
								color="warning"
								className="text-white"
								style={{ marginRight: '0.2rem', paddingBottom: '0.2rem' }}
								onClick={() => changeTaskStatus(taskId, 'complete')}
							>
								Incomplete
							</Button>
						) : (
							''
						)}
						<ButtonDropdown isOpen={dropdownOpen} toggle={toggle} size="sm">
							<DropdownToggle color="info" caret>
								Actions
							</DropdownToggle>
							<DropdownMenu>
								{assigned ? (
									<>
										<DropdownItem onClick={() => removeFromDailyTask(taskId)}>Remove from Todo</DropdownItem>
										<DropdownItem onClick={() => archeiveTasks(item._id)}>Archive Task</DropdownItem>
									</>
								) : (
									<DropdownItem onClick={addTask}>Move to todays task</DropdownItem>
								)}
								<DropdownItem>
									<a
										target="_blank"
										href={item.sourceData.url}
										rel="noopener noreferrer"
										style={{ textDecoration: 'none', color: 'black' }}
									>
										View Details
									</a>
								</DropdownItem>
							</DropdownMenu>
						</ButtonDropdown>
					</ButtonGroup>
				</TaskDiv>
			)}
		</>
	);
}
const TaskDiv = styled.div`
	padding: 0.4rem;
	display: flex;
	justify-content: space-between;
	background: ${props => (props.background === 'light' ? 'white' : 'rgb(242, 242, 242)')};
	box-sizing: border-box;
	margin-bottom: 0.3rem;
`;
const TaskOverView = styled.div`
	height: 100%;
	padding: 0;
`;
const TaskDetails = styled.div`
	display: flex;
	height: max-content;
	font-size: 0.6rem;
	font-weight: 600;
	padding: 0;
`;

const TaskTitle = styled.p`
	font-weight: 500;
	font-size: 0.9rem;
	padding: 0;
	margin: 0;
`;
const ButtonGroup = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

export default Task;
