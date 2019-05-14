import React, { Component } from 'react'
import { clientId, clientSecret } from './keys'
import LoginForm from 'LoginForm'
import './App.css'

class App extends Component {
	state = {
		status: '',
		token: null
	}

	componentDidMount() {
		const code = window.location.href.match(/?code=(.*)/) && window.location.href.match(/?code=(.*)/)[1]
		console.log(code)

		if (code) {
			this.setState({ status: 'loading' })
			fetch(`https://localhost:3000/authenticate/${code}`)
				.then((response) => response.json())
				.then(({ token }) => {
					this.setState({
						token,
						status: 'loaded'
					})
				})
		}
	}

	handleLogIn = () => {}

	render() {
		return (
			<div className='App'>
				<main>
					<LoginForm handleLogIn={this.handleLogIn} />
				</main>
			</div>
		)
	}
}

export default App
