import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import LoginForm from './components/forms/LoginButton'
import ProjectList from './components/containers/ProjectList'
import './App.css'
import NavBar from './components/NavBar'

const App = () => {
	const [ currUser, setCurrUser ] = useState(null)

	useEffect(() => {
		setCurrUser(getUserFromCookies('current_user'))
	}, [])

	const getUserFromCookies = () => {
		const key = 'current_user='
		const decodedCookie = decodeURIComponent(document.cookie)
		const ca = decodedCookie.split(';')
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i]
			while (c.charAt(0) === ' ') {
				c = c.substring(1)
			}
			if (c.indexOf(key) === 0) {
				const json = JSON.parse(c.substring(key.length, c.length))
				json.name && json.name.replace(/\+/g, ' ')
				return json
			}
		}
		return ''
	}

	const handleLogIn = (user) => {}

	return (
		<Router>
			<div classkey='App'>
				<NavBar />
				<main>
					<ProjectList />
				</main>
			</div>
		</Router>
	)
}

export default App
