export const setCurrentUser = (currentUser) => {
	return {
		type: 'SET_CURRENT_USER',
		currentUser
	}
}

export const selectProject = (project) => {
	return {
		type: 'SELECT_PROJECT',
		project
	}
}
