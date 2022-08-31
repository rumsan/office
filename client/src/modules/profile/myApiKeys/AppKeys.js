import React, { useState, useEffect, useContext } from 'react';
import { useToasts } from 'react-toast-notifications';
import { Card, CardBody, CardTitle, Input, Button, Label, FormGroup } from 'reactstrap';
import * as URL from '../../../constants/urls';
import { UserContext } from '../../../contexts/UserContext';

function AppKeys() {
	const { addToast } = useToasts();
	const { updateAppKey, getAppKeys } = useContext(UserContext);
	const [keys, setKeys] = useState(null);

	const fetchUserData = () => {
		getAppKeys()
			.then(res => {
				setKeys({ ...res });
			})
			.catch(e => addToast('Something went wrong', { appearance: 'error', autoDismiss: true }));
	};

	const changeKey = e => {
		setKeys({
			...keys,
			[e.target.name]: e.target.value
		});
	};

	const updateKeys = () => {
		updateAppKey(keys)
			.then(() => {
				addToast('Keys updated succesfully', { appearance: 'success', autoDismiss: true });
				fetchUserData();
			})
			.catch(e => addToast('Something went wrong', { appearance: 'error', autoDismiss: true }));
	};
	useEffect(fetchUserData, []);

	return (
		<Card style={{ marginTop: '.5rem' }}>
			<CardBody>
				<CardTitle> My API keys</CardTitle>
				<br />
				<FormGroup>
					<Label>MeisterTask</Label>
					<Input
						type="text"
						name="meistertask"
						value={keys && keys.meistertask ? keys.meistertask : ''}
						onChange={e => changeKey(e)}
					/>
					<span>
						<a target="_blank" rel="noopener noreferrer" href={URL.MEISTER_TASK_TOKEN}>
							How to get Meister token ?
						</a>{' '}
						| Link: &nbsp;{' '}
						<a target="_blank" rel="noopener noreferrer" href={URL.MEISTER_TASK_SIGNIN}>
							https://www.mindmeister.com/api
						</a>
					</span>
				</FormGroup>

				<FormGroup>
					<Label>GitLab</Label>
					<Input
						type="text"
						name="gitlab"
						value={keys && keys.gitlab ? keys.gitlab : ''}
						onChange={e => changeKey(e)}
					/>
					<span>
						Link: &nbsp;
						<a target="_blank" rel="noopener noreferrer" href={URL.GITLAB_SIGNIN}>
							https://lab.rumsan.net/profile/personal_access_tokens
						</a>
					</span>
				</FormGroup>
				<br />
				<Button color="success" onClick={updateKeys}>
					Save Changes
				</Button>
			</CardBody>
		</Card>
	);
}

export default AppKeys;
