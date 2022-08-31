import FullLayout from '../layouts/FullLayout.js';
import BlankLayout from '../layouts/BlankLayout.js';

var IndexRoutes = [
	{ path: '/authentication', name: 'Athentication', component: BlankLayout },
	{ path: '/', name: 'Dashboard', component: FullLayout }
];

export default IndexRoutes;
