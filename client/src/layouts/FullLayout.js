import React, { useState, useEffect, Suspense, useContext } from 'react';
import { Switch, Redirect } from 'react-router-dom';

import Header from './layout-components/header/Header';
import Sidebar from './layout-components/sidebar/Sidebar';
import Footer from './layout-components/footer/Footer';
import AppRoutes from '../routes/Router';
import Spinner from '../modules/spinner';
import { AppContext } from '../contexts/AppContext';

import { getUserRoles } from '../utils/sessionManager';
import ROLES from '../constants/roles';
import RoleBasedRoute from '../routes/RoleBasedRouter';

const currentRoles = getUserRoles();

export default props => {
	const [width, setWidth] = useState(window.innerWidth);

	const { settings } = useContext(AppContext);

	const isAdmin = currentRoles.includes(ROLES.ADMIN);
	const isManager = currentRoles.includes(ROLES.MANAGER);

	const SidebarRoutes = AppRoutes.filter(d => {
		if (isAdmin && d.state && d.state.includes(ROLES.ADMIN)) {
			d.showInSidebar = true;
		}
		if (isManager && d.state && d.state.includes(ROLES.MANAGER)) {
			d.showInSidebar = true;
		}
		return d.showInSidebar === true;
	});

	useEffect(() => {
		const updateDimensions = () => {
			let element = document.getElementById('main-wrapper');
			setWidth(window.innerWidth);
			switch (settings.activeSidebarType) {
				case 'full':
				case 'iconbar':
					if (width < 1170) {
						element.setAttribute('data-sidebartype', 'mini-sidebar');
						element.classList.add('mini-sidebar');
					} else {
						element.setAttribute('data-sidebartype', settings.activeSidebarType);
						element.classList.remove('mini-sidebar');
					}
					break;

				case 'overlay':
					if (width < 767) {
						element.setAttribute('data-sidebartype', 'mini-sidebar');
					} else {
						element.setAttribute('data-sidebartype', settings.activeSidebarType);
					}
					break;

				default:
			}
		};
		if (document.readyState === 'complete') {
			updateDimensions();
		}
		window.addEventListener('load', updateDimensions.bind(null));
		window.addEventListener('resize', updateDimensions.bind(null));
		return () => {
			window.removeEventListener('load', updateDimensions.bind(null));
			window.removeEventListener('resize', updateDimensions.bind(null));
		};
	}, [settings.activeSidebarType, width]);

	return (
		<div
			id="main-wrapper"
			dir={settings.activeDir}
			data-theme={settings.activeTheme}
			data-layout={settings.activeThemeLayout}
			data-sidebartype={settings.activeSidebarType}
			data-sidebar-position={settings.activeSidebarPos}
			data-header-position={settings.activeHeaderPos}
			data-boxed-layout={settings.activeLayout}
		>
			{/*--------------------------------------------------------------------------------*/}
			{/* Header                                                                         */}
			{/*--------------------------------------------------------------------------------*/}
			<Header />
			{/*--------------------------------------------------------------------------------*/}
			{/* Sidebar                                                                        */}
			{/*--------------------------------------------------------------------------------*/}
			<Sidebar {...props} routes={SidebarRoutes} />
			{/*--------------------------------------------------------------------------------*/}
			{/* Page Main-Content                                                              */}
			{/*--------------------------------------------------------------------------------*/}
			<div className="page-wrapper d-block">
				<div className="page-content container-fluid">
					<Suspense fallback={<Spinner />}>
						<Switch>
							{AppRoutes.map((prop, key) => {
								if (prop.navlabel) {
									return null;
								} else if (prop.collapse) {
									return prop.child.map((prop2, key2) => {
										if (prop2.collapse) {
											return prop2.subchild.map((prop3, key3) => {
												return (
													<RoleBasedRoute
														authorizedUsers={prop3.authorizedUsers}
														path={prop3.path}
														component={prop3.component}
														key={key3}
													/>
												);
											});
										}

										return (
											<RoleBasedRoute
												authorizedUsers={prop2.authorizedUsers}
												path={prop2.path}
												component={prop2.component}
												key={key2}
											/>
										);
									});
								} else if (prop.redirect) {
									return <Redirect from={prop.path} to={prop.pathTo} key={key} />;
								} else {
									return (
										<RoleBasedRoute
											authorizedUsers={prop.authorizedUsers}
											path={prop.path}
											component={prop.component}
											key={key}
										/>
									);
								}
							})}
						</Switch>
					</Suspense>
				</div>
				<Footer />
			</div>
			{/*--------------------------------------------------------------------------------*/}
			{/* Customizer from which you can set all the Layout Settings                      */}
			{/*--------------------------------------------------------------------------------*/}
		</div>
	);
};
