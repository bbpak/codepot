const SET_CURRENT_USER = Symbol()
const SET_PROJECTS = Symbol()
const SELECT_PROJECT = Symbol()

export const setCurrentUser = (currentUser) => {
	return {
		type: SET_CURRENT_USER,
		currentUser
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
