import React, { useState, useContext, lazy, useEffect } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Button } from 'reactstrap';

import classnames from 'classnames';
import Tour from 'reactour';
import { UserContext } from '../../contexts/UserContext';

import { getUser } from '../../utils/sessionManager';

const MyLeave = lazy(() => import('../leave/myLeave'));
const MyWallet = lazy(() => import('./myWallet'));
const MyDetails = lazy(() => import('./myDetails'));
const AppKeys = lazy(() => import('./myApiKeys'));
function Profile() {
	const { is_new } = getUser();
	const { updateMyDetails } = useContext(UserContext);

	const step1 = [
		{
			selector: '.profile-step',
			content: ({ goTo, inDom }) => (
				<div style={{ padding: '1rem 0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
					Go to my app keys.
					<Button
						size="sm"
						color="danger"
						onClick={() => endTour()}
						style={{ width: 'fit-content', margin: '0.5rem 0' }}
					>
						End tour
					</Button>
				</div>
			),
			style: {
				borderRadius: '10px'
			},
			stepInteraction: false
		}
	];
	const [activeTab, setActiveTab] = useState('1');
	const [isTourOpen, setIsTourOpen] = useState(false);

	const toggle = tab => {
		if (activeTab !== tab) setActiveTab(tab);
	};

	function endTour() {
		setIsTourOpen(false);
		updateMyDetails({ is_new: false });
	}
	useEffect(() => {
		if (!is_new) return;

		setTimeout(() => {
			setIsTourOpen(true);
		}, 500);
	}, [is_new]);
	return (
		<div>
			<Tour
				steps={step1}
				isOpen={is_new && isTourOpen}
				onRequestClose={() => endTour()}
				showButtons={false}
				showNumber={false}
				showNavigationNumber={false}
				showNavigation={false}
			/>

			<Nav tabs>
				<NavItem style={{ cursor: 'pointer' }}>
					<NavLink
						className={classnames({ active: activeTab === '1' })}
						onClick={() => {
							toggle('1');
						}}
					>
						My Details
					</NavLink>
				</NavItem>
				<NavItem style={{ cursor: 'pointer' }}>
					<NavLink
						className={`${classnames({ active: activeTab === '2' })} profile-step`}
						onClick={() => {
							toggle('2');
							setIsTourOpen(false);
						}}
					>
						My API Keys
					</NavLink>
				</NavItem>
				<NavItem style={{ cursor: 'pointer' }}>
					<NavLink
						className={classnames({ active: activeTab === '3' })}
						onClick={() => {
							toggle('3');
						}}
					>
						My Wallet
					</NavLink>
				</NavItem>
				<NavItem style={{ cursor: 'pointer' }}>
					<NavLink
						className={`${classnames({ active: activeTab === '4' })}`}
						onClick={() => {
							toggle('4');
							setIsTourOpen(false);
						}}
					>
						My Leave
					</NavLink>
				</NavItem>
			</Nav>
			<TabContent activeTab={activeTab} style={{ background: 'none' }}>
				<TabPane tabId="1">
					<MyDetails />
				</TabPane>
				<TabPane tabId="2">
					<AppKeys />
				</TabPane>
				<TabPane tabId="3">
					<MyWallet />
				</TabPane>
				<TabPane tabId="4">
					<MyLeave />
				</TabPane>
			</TabContent>
		</div>
	);
}

export default Profile;
