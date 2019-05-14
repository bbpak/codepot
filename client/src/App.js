import React, { Component } from 'react'
import LoginForm from './components/forms/LoginForm'
import './App.css'

const BASE_API_URL = 'http://localhost:3000/'

class App extends Component {
	state = {
		currentUser: null
	}

	componentDidMount() {
		// Parse code from URL
		const query = window.location.search.substring(1)
		const pairs = query.split('&').map((str) => str.split('='))
		const token = pairs.reduce((memo, pair) => {
			memo[pair[0]] = pair[1]
			return memo
		}, {})

		localStorage.setItem('token', token)
	}

	handleLogIn = () => {
		fetch(BASE_API_URL + 'auth/github')
	}

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
