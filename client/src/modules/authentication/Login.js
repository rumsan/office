import React, { useState, useContext } from 'react';
import {
	// InputGroup,
	// InputGroupAddon,
	// InputGroupText,
	Input,
	// CustomInput,
	FormGroup,
	Row,
	Col,
	Button,
	Form,
	Label
} from 'reactstrap';
import { useToasts } from 'react-toast-notifications';
import { GoogleLogin } from 'react-google-login';
// import img1 from '../../assets/images/logo-icon.png';
import img2 from '../../assets/images/background/login-register.jpg';

import { UserContext } from '../../contexts/UserContext';

// import ACTIONS from '../../actions/user';
import CLIENTID from '../../constants/clientId';

const sidebarBackground = {
	backgroundImage: 'url(' + img2 + ')',
	backgroundRepeat: 'no-repeat',
	backgroundPosition: 'bottom center',
	backgroundSize: 'cover'
};

const Login = () => {
	const { forgotPassword, verifyToken, resetPassword, googleLogin } = useContext(UserContext);
	const { addToast } = useToasts();

	// const handleForgotPassClick = () => {
	// 	var elem = document.getElementById('loginform');
	// 	elem.style.transition = 'all 2s ease-in-out';
	// 	elem.style.display = 'none';
	// 	document.getElementById('recoverform').style.display = 'block';
	// };

	// const [loginPayload, setLoginPayload] = useState({ username: '', password: '' });
	const [forgotPayload, setforgotPayload] = useState({ username: '' });
	const [tokenPayload, settokenPayload] = useState({ token: '' });
	const [newPasswordPayload, setnewPasswordPayload] = useState({ password: '', retypedPassword: '', notify: '' });
	const [userData, setuserData] = useState('');

	// const handleInputChange = e => {
	// 	setLoginPayload({ ...loginPayload, [e.target.name]: e.target.value });
	// };

	const handleUsernameChange = e => {
		setforgotPayload({ [e.target.name]: e.target.value });
	};

	const handleTokenChange = e => {
		settokenPayload({ [e.target.name]: e.target.value });
	};

	// const handleLoginFormSubmit = e => {
	// 	e.preventDefault();
	// 	return handleLogin(loginPayload);
	// };

	const handleForgotFormSubmit = e => {
		e.preventDefault();
		return handleForgot(forgotPayload);
	};

	const handleTokenSubmit = e => {
		e.preventDefault();
		return handleToken(tokenPayload);
	};

	const handleNewPasswordSubmit = e => {
		e.preventDefault();
		return handleNewPassword(newPasswordPayload);
	};

	// const handleLogin = async payload => {
	// 	try {
	// 		let d = await userLogin(payload);
	// 		dispatch({ type: ACTIONS.LOGIN, data: d.user });
	// 		window.location.replace('/');
	// 	} catch (e) {
	// 		let erroMsg = 'Invalid username or password';
	// 		if (e.message) erroMsg = e.message;
	// 		addToast(erroMsg, {
	// 			appearance: 'error',
	// 			autoDismiss: true
	// 		});
	// 	}
	// };

	const handleForgot = async payload => {
		try {
			let d = await forgotPassword(payload);
			addToast(d.msg, {
				appearance: 'success',
				autoDismiss: true
			});
			var elem = document.getElementById('recoverform');
			elem.style.transition = 'all 2s ease-in-out';
			elem.style.display = 'none';
			document.getElementById('verifyTokenForm').style.display = 'block';
			setforgotPayload({ username: '' });
		} catch (e) {
			let erroMsg = 'Something went wrong';
			if (e.message) erroMsg = e.message;
			addToast(erroMsg, {
				appearance: 'error',
				autoDismiss: true
			});
		}
	};

	const handleToken = async payload => {
		try {
			let d = await verifyToken(payload);
			const { _id, email, phone } = d;
			setuserData({ userId: _id, phone, email });
			const msg = 'Token Verified Successfully';
			addToast(msg, {
				appearance: 'success',
				autoDismiss: true
			});
			var elem = document.getElementById('verifyTokenForm');
			elem.style.transition = 'all 2s ease-in-out';
			elem.style.display = 'none';
			document.getElementById('resetForm').style.display = 'block';
			settokenPayload({ token: '' });
		} catch (e) {
			let erroMsg = 'Invalid Token or Token has expired';
			if (e.message) erroMsg = e.message;
			addToast(erroMsg, {
				appearance: 'error',
				autoDismiss: true
			});
		}
	};

	const handleNewPassword = async payload => {
		try {
			const { password, retypedPassword, notify } = payload;
			if (password !== retypedPassword) throw Error('Password Mismatch');
			if (notify === 'email' && !userData.email) throw Error('You have not set your email address yet');
			if (notify === 'phone' && !userData.phone) throw Error('You have not set your phone yet');
			const resetPayload = { password, notify };
			let d = await resetPassword(userData.userId, resetPayload);
			if (d.success) {
				const msg = 'Your Password has been changed successfully';
				addToast(msg, {
					appearance: 'success',
					autoDismiss: true
				});
			}
			var elem = document.getElementById('resetForm');
			elem.style.transition = 'all 2s ease-in-out';
			elem.style.display = 'none';
			document.getElementById('loginform').style.display = 'block';
			setnewPasswordPayload({ password: '', retypedPassword: '', notify: '' });
		} catch (e) {
			let erroMsg = 'Invalid Token or Token has expired';
			if (e.message) erroMsg = e.message;
			addToast(erroMsg, {
				appearance: 'error',
				autoDismiss: true
			});
		}
	};
	const responseGoogle = async response => {
		const { profileObj } = response;
		try {
			let { email } = profileObj;
			email = email.split('@')[1];
			if (
				[
					'rumsan.com',
					'rumsan.net',
					'gmail.com',
					'hamrolifebank.org',
					'rahat.io',
					'esatya.io',
					'agriclear.io'
				].includes(email)
			) {
				await googleLogin(profileObj);
				window.location.replace('/');
			} else throw new Error('User email must be from Rumsan Group of Companies');
		} catch (e) {
			let erroMsg = e.message;
			erroMsg =
				e && e.message !== 'Request failed with status code 500'
					? e.message
					: 'User Account Suspended. Contact Rumsan Admin.';
			addToast(erroMsg, {
				appearance: 'error',
				autoDismiss: true
			});
		}
	};

	return (
		<div className="">
			{/*--------------------------------------------------------------------------------*/}
			{/*Login Cards*/}
			{/*--------------------------------------------------------------------------------*/}
			<div className="auth-wrapper d-flex no-block justify-content-center align-items-center" style={sidebarBackground}>
				<div className="auth-box">
					<div id="loginform">
						<div className="logo">
							<span className="db">
								<img
									src="https://assets.rumsan.com/rumsan-group/rumsan-group-logo.png"
									alt="logo"
									width="45%"
									height="auto"
								/>
							</span>
							<h5 className="font-medium mb-3">Daily Task Management</h5>
						</div>
						<Row className="mb-3">
							<Col xs="12 d-flex align-items-center justify-content-center">
								<GoogleLogin
									className="btn"
									clientId={CLIENTID.clientId}
									buttonText="Login with Google"
									onSuccess={responseGoogle}
									onFailure={responseGoogle}
									cookiePolicy={'single_host_origin'}
									isSignedIn={false}
									theme="dark"
								/>
							</Col>
						</Row>
					</div>
					<div id="recoverform">
						<div className="logo">
							<span className="db">
								<img
									src="https://assets.rumsan.com/rumsan-group/rumsan-group-logo.png"
									alt="logo"
									width="45%"
									height="auto"
								/>
							</span>
							<h5 className="font-medium mb-3">Recover Password</h5>
							<span>Enter your Email/Phone and instructions will be sent to you!</span>
						</div>
						<Row className="mt-3">
							<Col xs="12">
								<Form onSubmit={handleForgotFormSubmit}>
									<FormGroup>
										<Input
											type="text"
											name="username"
											bsSize="lg"
											id="Name"
											value={forgotPayload.username ? forgotPayload.username : ''}
											placeholder="Phone/Email"
											onChange={handleUsernameChange}
											required
										/>
									</FormGroup>
									<Row className="mt-3">
										<Col xs="12">
											<Button color="danger" size="lg" type="submit" block>
												Reset
											</Button>
										</Col>
									</Row>
								</Form>
							</Col>
						</Row>
					</div>
					<div id="verifyTokenForm" style={{ display: 'none' }}>
						<div className="logo">
							<span className="db">
								<img
									src="https://assets.rumsan.com/rumsan-group/rumsan-group-logo.png"
									alt="logo"
									width="45%"
									height="auto"
								/>
							</span>
							<h5 className="font-medium mb-3">Verify Token</h5>
							<span>Please enter the token you received below</span>
						</div>
						<Row className="mt-3">
							<Col xs="12">
								<Form onSubmit={handleTokenSubmit}>
									<FormGroup>
										<Input
											type="text"
											name="token"
											bsSize="lg"
											id="token"
											value={tokenPayload.token ? tokenPayload.token : ''}
											placeholder="Token"
											onChange={handleTokenChange}
											required
										/>
									</FormGroup>
									<Row className="mt-3">
										<Col xs="12">
											<Button color="danger" size="lg" type="submit" block>
												Verify
											</Button>
										</Col>
									</Row>
								</Form>
							</Col>
						</Row>
					</div>
					<div id="resetForm" style={{ display: 'none' }}>
						<div className="logo">
							<span className="db">
								<img
									src="https://assets.rumsan.com/rumsan-group/rumsan-group-logo.png"
									alt="logo"
									width="45%"
									height="auto"
								/>
							</span>
							<h5 className="font-medium mb-3">Reset Password</h5>
							<span>Please enter your new password below</span>
						</div>
						<Row className="mt-3">
							<Col xs="12">
								<Form onSubmit={handleNewPasswordSubmit}>
									<FormGroup>
										<Input
											type="password"
											name="password"
											bsSize="lg"
											id="password"
											value={newPasswordPayload.password ? tokenPayload.password : ''}
											placeholder="New Password"
											onChange={e => setnewPasswordPayload({ ...newPasswordPayload, [e.target.name]: e.target.value })}
											required
										/>
									</FormGroup>
									<FormGroup>
										<Input
											type="password"
											name="retypedPassword"
											bsSize="lg"
											id="retypedPassword"
											value={newPasswordPayload.retypedPassword ? tokenPayload.retypedPassword : ''}
											placeholder="Retype Password"
											onChange={e => setnewPasswordPayload({ ...newPasswordPayload, [e.target.name]: e.target.value })}
											required
										/>
									</FormGroup>
									<FormGroup>
										<Label check>
											<strong>Notify Me By:</strong>
										</Label>
										<FormGroup check>
											<Label check>
												<Input
													type="radio"
													name="notify"
													value="email"
													onChange={e =>
														setnewPasswordPayload({ ...newPasswordPayload, [e.target.name]: e.target.value })
													}
													required
												/>{' '}
												Email
											</Label>
										</FormGroup>
										<FormGroup check>
											<Label check>
												<Input
													type="radio"
													name="notify"
													value="phone"
													onChange={e =>
														setnewPasswordPayload({ ...newPasswordPayload, [e.target.name]: e.target.value })
													}
													required
												/>{' '}
												Phone
											</Label>
										</FormGroup>
									</FormGroup>
									<Row className="mt-3">
										<Col xs="12">
											<Button color="primary" size="lg" type="submit" block>
												Change Password
											</Button>
										</Col>
									</Row>
								</Form>
							</Col>
						</Row>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
