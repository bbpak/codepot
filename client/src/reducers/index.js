import { combineReducers } from 'redux'
import { actionTypes } from '../actions'

const currentUserReducer = (currentUser = null, action) => {
	switch (action.type) {
		case actionTypes.SET_CURRENT_USER:
			return action.currentUser
		default:
			return currentUser
	}
}

const projectsReducer = (projects = [], action) => {
	switch (action.type) {
		case actionTypes.SET_PROJECTS:
			return action.projects
		default:
			return projects
	}
}

const selectedProjectReducer = (selectedProject = null, action) => {
	switch (action.type) {
		case actionTypes.SELECT_PROJECT:
			return action.project
		default:
			return selectedProject
	}
}

export default combineReducers({
	currentUser: currentUserReducer,
	projects: projectsReducer,
	selectedProject: selectedProjectReducer
})
