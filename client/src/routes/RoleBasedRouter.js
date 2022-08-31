import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import ROLE from '../constants/roles';

import { getUser } from '../utils/sessionManager';

export const RoleBasedRoute = ({ component: Component, authorizedUsers, ...rest }) => (
	<Route
		{...rest}
		render={props => {
			const currentUser = getUser();
			const { roles } = currentUser;

			if (authorizedUsers && authorizedUsers.includes(ROLE.ALL)) {
				return <Component {...props} />;
			}
			if (authorizedUsers && roles.some(val => authorizedUsers.includes(val))) {
				return <Component {...props} />;
			}

			return (
				<Redirect
					to={{
						pathname: '/unauthorized',
						state: { from: props.location }
					}}
				/>
			);
		}}
	/>
);

export default RoleBasedRoute;
