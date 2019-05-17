import React, { Component } from 'react'

const AUTH_URL = 'https://github.com/login/oauth/authorize'
const CLIENT_ID = 'cfdfc439f3903950d3c7'
const SCOPE = 'read:user'

class LoginForm extends Component {
	handleLogIn() {
		this.props.handleLogIn()
	}

	render() {
		return (
			<button onClick={this.handleLogin}>
				<a href={`${AUTH_URL}?client_id=${CLIENT_ID}`}>Log in with GitHub</a>
			</button>
		)
	}
}

export default LoginForm
