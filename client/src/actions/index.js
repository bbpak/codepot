const SET_CURRENT_USER = 'SET_CURRENT_USER'
const SET_PROJECTS = 'SET_PROJECTS'
const SELECT_PROJECT = 'SELECT_PROJECT'

export const setCurrentUser = (currentUser) => {
	return {
		type: SET_CURRENT_USER,
		currentUser
	}
}

export const setProjects = (projects) => {
	return {
		type: SET_PROJECTS,
		projects
	}
}

export const selectProject = (project) => {
	return {
		type: SELECT_PROJECT,
		project
	}
}

export const actionTypes = {
	SET_CURRENT_USER,
	SET_PROJECTS,
	SELECT_PROJECT
}
