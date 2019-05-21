import { combineReducers } from 'redux'

const currentUserReducer = (currentUser = null, action) => {
	switch (action.type) {
		case 'SET_CURRENT_USER':
			return action.currentUser
		default:
			return currentUser
	}
}

const projectsReducer = (projects = [], action) => {
	return projects
}

const selectedProjectReducer = (selectedProject = null, action) => {
	switch (action.type) {
		case 'SELECT_PROJECT':
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
