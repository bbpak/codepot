import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import LoginForm from './components/forms/LoginForm'
import ProjectList from './components/containers/ProjectList'
import './App.css'

window._API_URL_ = 'http://localhost:3000/'

const App = () => {
	const [ currUser ] = useState(null)

	useEffect(() => {
		const query = window.location.search.substring(1)
		const pairs = query.split('&').map((str) => str.split('='))
		const data = pairs.reduce((memo, pair) => {
			memo[pair[0]] = pair[1]
			return memo
		}, {})

		console.log(getCookie('user'))
	})

	const getCookie = (cname) => {
		var name = cname + '='
		var decodedCookie = decodeURIComponent(document.cookie)
		var ca = decodedCookie.split(';')
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i]
			while (c.charAt(0) == ' ') {
				c = c.substring(1)
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length)
			}
		}
		return ''
	}

	const handleLogIn = (user) => {}

	return (
		<Router>
			<div className='App'>
				<main>
					<LoginForm handleLogIn={handleLogIn} />
					<ProjectList />
				</main>
			</div>
		</Router>
	)
}

export default App
