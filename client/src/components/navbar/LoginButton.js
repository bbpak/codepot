import React from 'react'
import { Button, Icon } from 'semantic-ui-react'

const AUTH_URL = 'https://github.com/login/oauth/authorize'
const CLIENT_ID = 'cfdfc439f3903950d3c7'

const LoginButton = (props) => {
	return (
		<Button color='blue' icon size='small' href={`${AUTH_URL}?client_id=${CLIENT_ID}`} onClick={props.handleLogin}>
			<Icon name='github' />&nbsp;&nbsp;Sign in with GitHub
		</Button>
	)
}

export default LoginButton
