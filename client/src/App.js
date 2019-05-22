import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { Container } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { setCurrentUser } from './actions'
import ProjectList from './components/containers/ProjectList'
import './App.css'
import NavBar from './components/navbar/NavBar'
import ProjectForm from './components/forms/ProjectForm'

window._API_URL_ = 'http://localhost:3000/api/'

const App = (props) => {
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

	// Set current user from cookies after login
	!props.currentUser && props.setCurrentUser(getUserFromCookies('current_user'))

	return (
		<Router>
			<div classkey='App' className='App'>
				<NavBar />
				<Container>
					{props.currentUser && <ProjectForm />}
					<ProjectList />
				</Container>
			</div>
		</Router>
	)
}

const mapStateToProps = (state) => {
	return {
		currentUser: state.currentUser
	}
}
export default connect(mapStateToProps, { setCurrentUser })(App)
