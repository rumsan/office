import { lazy } from 'react';
import * as ROLE from '../constants/roles';

const ChargeHours = lazy(() => import('../modules/chargeHours'));
const Dashboard = lazy(() => import('../modules/dashboard'));
const DailyTaskList = lazy(() => import('../modules/taskList/dailyTaskList'));
const EditUser = lazy(() => import('../modules/users/edit'));
const LeaveList = lazy(() => import('../modules/leave/list'));
const Profile = lazy(() => import('../modules/profile'));
const ProjectList = lazy(() => import('../modules/projects/list'));
const ProjectDetail = lazy(() => import('../modules/projects/details'));
const Roles = lazy(() => import('../modules/roles'));
const Settings = lazy(() => import('../modules/settings'));
const UnAuthorized = lazy(() => import('../modules/unauthorized'));
const UsersList = lazy(() => import('../modules/users/list'));

var AppRoutes = [
	{
		path: '/dashboard',
		name: 'Dashboard',
		icon: 'home',
		component: Dashboard,
		showInSidebar: true,
		authorizedUsers: [ROLE.ALL]
	},
	{
		path: '/daily-task-list',
		name: 'Daily TaskList',
		icon: 'list',
		state: [ROLE.ADMIN, ROLE.MANAGER],
		component: DailyTaskList,
		showInSidebar: false,
		authorizedUsers: [ROLE.ADMIN, ROLE.MANAGER]
	},
	{
		path: '/projects/:id',
		component: ProjectDetail,
		showInSidebar: false,
		authorizedUsers: [ROLE.ADMIN, ROLE.MANAGER]
	},
	{
		path: '/projects',
		name: 'Projects',
		icon: 'list',
		state: [ROLE.ADMIN, ROLE.MANAGER],
		component: ProjectList,
		showInSidebar: false,
		authorizedUsers: [ROLE.ADMIN, ROLE.MANAGER]
	},
	{
		path: '/charge-hours',
		name: 'Charge Hours',
		icon: 'clock',
		state: [ROLE.ADMIN, ROLE.MANAGER],
		component: ChargeHours,
		showInSidebar: false,
		authorizedUsers: [ROLE.ADMIN, ROLE.MANAGER]
	},
	{
		path: '/users/:id',
		component: EditUser,
		showInSidebar: false,
		authorizedUsers: [ROLE.ADMIN]
	},

	{
		path: '/profile',
		name: 'My Profile',
		icon: 'user',
		component: Profile,
		showInSidebar: false,
		authorizedUsers: [ROLE.ALL]
	},
	{
		path: '/unauthorized',
		component: UnAuthorized,
		showInSidebar: false,
		authorizedUsers: [ROLE.ALL]
	},
	{
		collapse: true,
		name: 'Administration',
		state: [ROLE.ADMIN],
		icon: 'lock',
		child: [
			{
				path: '/leave',
				name: 'Leave Requests',
				icon: 'list',
				component: LeaveList,
				authorizedUsers: [ROLE.ADMIN]
			},
			{
				path: '/settings',
				name: 'Settings',
				mini: 'B',
				icon: 'settings',
				component: Settings,
				authorizedUsers: [ROLE.ADMIN]
			},
			{
				path: '/users',
				name: 'Users',
				mini: 'B',
				icon: 'users',
				component: UsersList,
				authorizedUsers: [ROLE.ADMIN]
			},
			{
				path: '/roles',
				name: 'Roles',
				mini: 'B',
				icon: 'rss',
				component: Roles,
				authorizedUsers: [ROLE.ADMIN]
			}
		]
	},
	{ path: '/', pathTo: '/dashboard', name: 'Dashboard', redirect: true }
];
export default AppRoutes;
