import React, { Component, Fragment } from 'react'

const authorizeUrl = 'https://github.com/login/oauth/authorize'
const clientId = 'cfdfc439f3903950d3c7'

class LoginForm extends Component {
	handleLogIn() {
		this.props.handleLogIn()
	}

	render() {
		return (
			<button onClick={this.handleLogin}>
				<a href={`${authorizeUrl}?client_id=${clientId}`}>Log in with GitHub</a>
			</button>
		)
	}
}

export default LoginForm
