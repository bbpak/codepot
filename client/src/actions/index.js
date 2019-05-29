const SET_CURRENT_USER = Symbol()
const SET_PROJECTS = Symbol()
const SELECT_PROJECT = Symbol()
const SET_TAG_OPTIONS = Symbol()

export const setCurrentUser = (currentUser) => {
	return {
		type: SET_CURRENT_USER,
		currentUser
	}
}

export const setTagOptions = (tagOptions) => {
	return {
		type: SET_TAG_OPTIONS,
		tagOptions
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
	SET_TAG_OPTIONS,
	SELECT_PROJECT
}
