import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const PrivateRoute = ({ component: Component, ...rest }) => (
	<Route
		{...rest}
		render={props => {
			const currentUser = localStorage.getItem('currentUser');

			if (!currentUser) {
				return (
					<Redirect
						to={{
							pathname: '/authentication/Login',
							state: { from: props.location }
						}}
					/>
				);
			}

			// authorised so return component
			return <Component {...props} />;
		}}
	/>
);

export default PrivateRoute;
