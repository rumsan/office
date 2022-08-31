import React, { useState, useContext, useEffect, useRef } from 'react';
import {
	Nav,
	NavItem,
	NavLink,
	Navbar,
	NavbarBrand,
	Collapse,
	UncontrolledDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	Col,
	Row,
	Button
} from 'reactstrap';
import { useHistory } from 'react-router-dom';

// import * as data from './Data';
import { AppContext } from '../../../contexts/AppContext';
import { logoutUser, getUser } from '../../../utils/sessionManager';
/*--------------------------------------------------------------------------------*/
/* Import images which are need for the HEADER                                    */
/*--------------------------------------------------------------------------------*/
import logodarkicon from '../../../assets/images/logo-icon.png';
import logolighticon from '../../../assets/images/logo-light-icon.png';
import logodarktext from '../../../assets/images/logo-text.png';
import logolighttext from '../../../assets/images/logo-light-text.png';
import profilephoto from '../../../assets/images/users/1.jpg';
import { Link } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import PerfectScrollbar from 'react-perfect-scrollbar';
import styled from 'styled-components';

import RequestLeave from '../../../modules/leave/myLeave/RequestLeave';
import * as ACTION from '../../../actions/notification';

const API_SERVER = process.env.REACT_APP_API_SERVER;
const WSS_SERVER = API_SERVER.replace('http', 'ws');

const user = getUser();

export default () => {
	const [isOpen, setIsOpen] = useState(false);
	const ws = useRef(null);
	const { addToast } = useToasts();
	const history = useHistory();

	const {
		dispatch,
		notificationList,
		settings,
		fetchNotifications,
		markNotificationAsRead,
		markAllNotificationsAsRead
	} = useContext(AppContext);

	const handleLogout = () => {
		logoutUser();
	};

	const toggle = () => {
		setIsOpen(!isOpen);
	};

	const showMobilemenu = () => {
		document.getElementById('main-wrapper').classList.toggle('show-sidebar');
	};

	const sidebarHandler = () => {
		let element = document.getElementById('main-wrapper');
		switch (settings.activeSidebarType) {
			case 'full':
			case 'iconbar':
				element.classList.toggle('mini-sidebar');
				if (element.classList.contains('mini-sidebar')) {
					element.setAttribute('data-sidebartype', 'mini-sidebar');
				} else {
					element.setAttribute('data-sidebartype', settings.activeSidebarType);
				}
				break;
			case 'overlay':
			case 'mini-sidebar':
				element.classList.toggle('full');
				if (element.classList.contains('full')) {
					element.setAttribute('data-sidebartype', 'full');
				} else {
					element.setAttribute('data-sidebartype', settings.activeSidebarType);
				}
				break;
			default:
		}
	};

	useEffect(() => {
		ws.current = new WebSocket(WSS_SERVER);
		return () => {
			ws.current.close();
		};
	}, []);

	useEffect(() => {
		if (!ws.current) return;

		ws.current.onopen = () => {
			user && ws.current.send(JSON.stringify({ userId: user._id, action: 'authenticate' }));
		};

		ws.current.onmessage = e => {
			const jsonData = JSON.parse(e.data);
			if (jsonData.action === 'LEAVE_REQUEST') {
				dispatch({ type: ACTION.FETCH_NEW_NOTIFICATIONS, data: jsonData.data });
			}
		};
	}, [dispatch]);

	const fetchNotificationsList = () => {
		fetchNotifications(user._id)
			.then()
			.catch(err => {
				addToast('Failed to Fetch Notifications', { appearance: 'error', autoDismiss: true });
			});
	};

	const markAsRead = noti => {
		const { _id, redirectUrl } = noti;
		markNotificationAsRead(_id, user._id)
			.then(d => {
				fetchNotificationsList();
				history.push(redirectUrl);
			})
			.catch(err => {
				console.log(err);
			});
	};

	const markAllAsRead = () => {
		markAllNotificationsAsRead(user._id)
			.then(d => fetchNotificationsList())
			.catch(err => {
				console.log(err);
			});
	};

	useEffect(fetchNotificationsList, []);

	return (
		<header className="topbar navbarbg" data-navbarbg={settings.activeNavbarBg}>
			<Navbar
				className={'top-navbar ' + (settings.activeNavbarBg === 'skin6' ? 'navbar-light' : 'navbar-dark')}
				expand="md"
			>
				<div className="navbar-header" id="logobg" data-logobg={settings.activeLogoBg}>
					{/*--------------------------------------------------------------------------------*/}
					{/* Mobile View Toggler  [visible only after 768px screen]                         */}
					{/*--------------------------------------------------------------------------------*/}
					<span className="nav-toggler d-block d-md-none" onClick={showMobilemenu.bind(null)}>
						<i className="ti-menu ti-close" />
					</span>
					{/*--------------------------------------------------------------------------------*/}
					{/* Logos Or Icon will be goes here for Light Layout && Dark Layout                */}
					{/*--------------------------------------------------------------------------------*/}
					<NavbarBrand href="/">
						<b className="logo-icon">
							<img src={logodarkicon} alt="homepage" className="dark-logo" />
							<img src={logolighticon} alt="homepage" className="light-logo" />
						</b>
						<span className="logo-text">
							<img src={logodarktext} alt="homepage" className="dark-logo" />
							<img src={logolighttext} className="light-logo" alt="homepage" />
						</span>
					</NavbarBrand>
					{/*--------------------------------------------------------------------------------*/}
					{/* Mobile View Toggler  [visible only after 768px screen]                         */}
					{/*--------------------------------------------------------------------------------*/}
					<span className="topbartoggler d-block d-md-none" onClick={toggle.bind(null)}>
						<i className="ti-more" />
					</span>
				</div>
				<Collapse className="navbarbg" isOpen={isOpen} navbar data-navbarbg={settings.activeNavbarBg}>
					<Nav className="float-left" navbar>
						<NavItem>
							<NavLink href="#" className="d-none d-md-block" onClick={sidebarHandler.bind(null)}>
								<i className="ti-menu" />
							</NavLink>
						</NavItem>
						{/*--------------------------------------------------------------------------------*/}
					</Nav>
					<Nav className="ml-auto float-right" navbar>
						<RequestLeave />

						{/*--------------------------------------------------------------------------------*/}
						{/* Start Notifications Dropdown                                                   */}
						{/*--------------------------------------------------------------------------------*/}
						<UncontrolledDropdown nav inNavbar>
							<DropdownToggle nav caret>
								<i className="mdi mdi-bell font-24" />
								<sup>
									<span className="badge badge-danger">
										{notificationList?.filter(n => n.notifyTo.filter(m => m.userId === user._id)).length}
									</span>
								</sup>
							</DropdownToggle>
							<DropdownMenu right className="mailbox">
								<PerfectScrollbar>
									<div style={{ maxHeight: '500px', width: '400px' }}>
										<div className="d-flex align-items-center p-2 bg-primary text-white mb-1">
											<h4>Notifications</h4>
											{notificationList?.length ? (
												<Button type="button" className="ml-auto btn btn-sm btn-primary" onClick={markAllAsRead}>
													Mark All As Read
												</Button>
											) : (
												''
											)}
										</div>
										{notificationList.length ? (
											notificationList.map((notification, index) => {
												return (
													<DropdownItem key={index} onClick={e => markAsRead(notification)}>
														<NotificationDiv
															background={notification?.notifyTo.filter(n => n.userId === user._id)[0].isRead}
														>
															<Row>
																<Col md={2} className="text-center" style={{ alignSelf: 'center' }}>
																	<i className="mdi mdi-bell font-24" />
																</Col>
																<Col md={10}>
																	<strong>{notification.message}</strong>
																	<br />
																	<p>{notification.description}</p>
																</Col>
															</Row>
														</NotificationDiv>
													</DropdownItem>
												);
											})
										) : (
											<NotificationDiv>
												<strong>No New Notifications</strong>
											</NotificationDiv>
										)}
									</div>
								</PerfectScrollbar>
							</DropdownMenu>
						</UncontrolledDropdown>
						{/*--------------------------------------------------------------------------------*/}
						{/* End Notifications Dropdown                                                     */}
						{/*--------------------------------------------------------------------------------*/}
						{/*--------------------------------------------------------------------------------*/}
						{/* Start Profile Dropdown                                                         */}
						{/*--------------------------------------------------------------------------------*/}
						<UncontrolledDropdown nav inNavbar>
							<DropdownToggle nav caret className="pro-pic">
								<img src={profilephoto} alt="user" className="rounded-circle" width="31" />
							</DropdownToggle>
							<DropdownMenu right className="user-dd">
								<span className="with-arrow">
									<span className="bg-primary" />
								</span>
								<div className="d-flex no-block align-items-center p-3 bg-primary text-white mb-2">
									<div className="">
										<img src={profilephoto} alt="user" className="rounded-circle" width="60" />
									</div>
									<div className="ml-2">
										<h4 className="mb-0">{user && user.name && user.name.full}</h4>
										<p className=" mb-0">{user && user.email}</p>
									</div>
								</div>
								<Link to="/profile">
									<DropdownItem>
										<i className="fas fa-user mr-1 ml-1" /> Profile
									</DropdownItem>
								</Link>

								<DropdownItem divider />
								<DropdownItem onClick={handleLogout}>
									<i className="fa fa-power-off mr-1 ml-1" /> Logout
								</DropdownItem>
							</DropdownMenu>
						</UncontrolledDropdown>
						{/*--------------------------------------------------------------------------------*/}
						{/* End Profile Dropdown                                                           */}
						{/*--------------------------------------------------------------------------------*/}
					</Nav>
				</Collapse>
			</Navbar>
		</header>
	);
};

const NotificationDiv = styled.div`
	padding: 0.5rem;
	background: ${props => (props.background ? 'white' : 'rgb(242, 242, 242)')};
	box-sizing: border-box;
`;
