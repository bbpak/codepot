import React, { useEffect } from 'react'
import { Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { setCurrentUser, setProjects } from './actions'
import ProjectsContainer from './components/containers/ProjectsContainer'
import NavBar from './components/navbar/NavBar'
import ProjectForm from './components/forms/ProjectForm'
import './App.css'

window._API_URL_ = 'http://localhost:3000/'

const App = (props) => {
	useEffect(() => {
		// Fetch all projects for now, set limits if there are a lot
		fetch(window._API_URL_ + 'projects').then((res) => res.json()).then((data) => {
			props.setProjects(data)
		})
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

	// Set current user from cookies after login
	!props.currentUser && props.setCurrentUser(getUserFromCookies('current_user'))

	console.log(props.projects)
	return (
		<div classkey='App' className='App'>
			<NavBar />
			<main className='main-container'>
				<Route exact path='/' component={ProjectsContainer} />
				<Route exact path='/new-project' component={ProjectForm} />
			</main>
		</div>
	)
}

const mapStateToProps = (state) => {
	return {
		currentUser: state.currentUser,
		projects: state.projects
	}
}
export default connect(mapStateToProps, { setCurrentUser, setProjects })(App)
