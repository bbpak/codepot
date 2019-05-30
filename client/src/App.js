import React, { useEffect } from 'react'
import { Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'
import { setCurrentUser, selectProject, setProjects, setTagOptions } from './actions'
import ProjectsContainer from './components/projects/ProjectsContainer'
import NavBar from './components/navbar/NavBar'
import ProjectForm from './components/forms/ProjectForm'
import Profile from './components/users/Profile'
import './App.css'

window._API_URL_ = 'http://localhost:3000/'
window._CLOUD_URL_ = 'https://res.cloudinary.com/crudhub/image/upload/'

const App = (props) => {
	// Make select options for tags from tags data
	const makeTagOptions = (tags) => {
		return tags.map((tag) => {
			return {
				key: tag.name,
				value: tag.name,
				text: tag.name
			}
		})
	}

	useEffect(() => {
		const allTags = JSON.parse(sessionStorage.getItem('allTags'))

		// Fetch all tags and store in session storage
		if (!allTags) {
			axios.get(window._API_URL_ + 'projects/tags').then((resp) => {
				sessionStorage.setItem('allTags', JSON.stringify(resp.data))
				props.setTagOptions(makeTagOptions(resp.data))
			})
		} else {
			props.setTagOptions(makeTagOptions(allTags))
		}

		// Fetch all projects
		axios.get(window._API_URL_ + 'projects').then((resp) => {
			props.setProjects(resp.data)
		})

		// let allProjects = JSON.parse(sessionStorage.getItem('projects'))

		// if (!allProjects) {
		// 	// Fetch all projects for now, set limits if there are a lot
		// 	axios.get(window._API_URL_ + 'projects').then((resp) => {
		// 		props.setProjects(resp.data)
		// 		sessionStorage.setItem('projects', JSON.stringify(resp.data))
		// 	})
		// } else {
		// 	props.setProjects(allProjects)
		// }
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

	return (
		<div classkey='App' className='App'>
			<NavBar />
			<main className='main-container'>
				<Switch>
					<Route exact path='/' component={ProjectsContainer} />
					<Route exact path='/projects/new' component={ProjectForm} />
					<Route exact path='/:username' component={Profile} />
					<Route exact path='/:username/:project' component={ProjectForm} />
				</Switch>
			</main>
		</div>
	)
}

const mapStateToProps = (state) => {
	return {
		currentUser: state.currentUser,
		tagOptions: state.tagOptions,
		projects: state.projects
	}
}
export default connect(mapStateToProps, { setCurrentUser, setProjects, selectProject, setTagOptions })(App)
