import React from 'react';
import indexRoutes from '../routes';
import { Router, Route, Switch } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

import { History } from '../utils/History';
import { PrivateRoute } from '../routes/PrivateRoutes';
import BlankLayout from '../layouts/BlankLayout';
import { AppContextProvider } from '../contexts/AppContext';
import { UserContextProvider } from '../contexts/UserContext';

const App = () => {
	return (
		<AppContextProvider>
			<ToastProvider>
				<UserContextProvider>
					<Router history={History}>
						<Switch>
							<Route exact path="/authentication/login" component={BlankLayout} />

							{indexRoutes.map((prop, key) => {
								return <PrivateRoute path={prop.path} key={key} component={prop.component} />;
							})}
						</Switch>
					</Router>
				</UserContextProvider>
			</ToastProvider>
		</AppContextProvider>
	);
};
export default App;
