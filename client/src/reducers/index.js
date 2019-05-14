import { combineReducers } from 'redux'

const projectsReducer = (projects = [], action) => {
	return [ { name: 1 }, { name: 2 }, { name: 3 } ]
}

const selectedProjectReducer = (selectedProject = null, action) => {
	switch (action.type) {
		case 'SELECT_PROJECT':
			return action.payload
		default:
			return selectedProject
	}
}

export default combineReducers({
	projects: projectsReducer,
	selectedProject: selectedProjectReducer
})
