import React, { Component, Fragment } from 'react'
import { clientId } from '../keys'

class LoginForm extends Component {
	handleLogIn() {
		this.props.handleLogIn()
	}

	render() {
		return (
			<button onClick={this.handleLogin}>
				<a
					href={`http://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${'localhost:3001'}`}>
					Log in with GitHub
				</a>
			</button>
		)
	}
}

export default LoginForm
