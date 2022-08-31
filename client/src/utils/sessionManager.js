function getUser() {
	if (localStorage.getItem('currentUser') && Object.keys(localStorage.getItem('currentUser')).length) {
		return JSON.parse(localStorage.getItem('currentUser'));
	}
	return null;
}

function getUserIdOnly() {
	if (localStorage.getItem('currentUser') && Object.keys(localStorage.getItem('currentUser')).length) {
		const { id } = JSON.parse(localStorage.getItem('currentUser'));
		return id;
	}
	return null;
}

function getUserTeamName() {
	if (localStorage.getItem('currentUser') && Object.keys(localStorage.getItem('currentUser')).length) {
		const { team } = JSON.parse(localStorage.getItem('currentUser'));
		return team;
	}
	return null;
}

function saveUser(userData) {
	localStorage.setItem('currentUser', JSON.stringify(userData));
}

function saveUserRoles(roles) {
	localStorage.setItem('userRoles', JSON.stringify(roles));
}

function getUserRoles() {
	return JSON.parse(localStorage.getItem('userRoles'));
}

function saveUserToken(token) {
	localStorage.setItem('token', token);
}

function saveUserPermissions(perms) {
	localStorage.setItem('userPermissions', perms);
}

function getUserPermissions() {
	if (localStorage.getItem('userPermissions') && Object.keys(localStorage.getItem('userPermissions')).length) {
		return JSON.parse(localStorage.getItem('userPermissions'));
	}
	return [];
}

function logoutUser() {
	localStorage.clear();
	window.location = '/authentication/login';
}

function getUserToken() {
	return localStorage.getItem('token');
}

module.exports = {
	getUser,
	saveUser,
	saveUserRoles,
	getUserRoles,
	saveUserToken,
	saveUserPermissions,
	getUserPermissions,
	logoutUser,
	getUserToken,
	getUserIdOnly,
	getUserTeamName
};
