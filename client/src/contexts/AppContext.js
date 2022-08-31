import React, { createContext, useReducer } from 'react';
import appReduce from '../reducers/appReducer';
import * as Service from '../services/notification';
import * as ACTION from '../actions/notification';

const initialState = {
	settings: {
		activeDir: 'ltr',
		activeThemeLayout: 'vertical',
		activeTheme: 'light',
		activeSidebarType: 'full',
		activeLogoBg: 'skin6',
		activeNavbarBg: 'skin1',
		activeSidebarBg: 'skin6',
		activeSidebarPos: 'fixed',
		activeHeaderPos: 'fixed',
		activeLayout: 'full'
	},
	notificationList: []
};

export const AppContext = createContext(initialState);
export const AppContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(appReduce, initialState);

	async function fetchNotifications(userId) {
		return new Promise((resolve, reject) => {
			Service.fetchNotifications(userId)
				.then(res => {
					dispatch({ type: ACTION.GET_NOTIFICATIONS_LIST, res });
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
		});
	}

	async function markNotificationAsRead(id, userId) {
		return new Promise((resolve, reject) => {
			Service.markNotificationAsRead(id, userId)
				.then(res => {
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
		});
	}

	async function markAllNotificationsAsRead(userId) {
		return new Promise((resolve, reject) => {
			Service.markAllNotificationsAsRead(userId)
				.then(res => {
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
		});
	}

	return (
		<AppContext.Provider
			value={{
				notificationList: state.notificationList,
				dispatch,
				settings: state.settings,
				fetchNotifications,
				markNotificationAsRead,
				markAllNotificationsAsRead
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
