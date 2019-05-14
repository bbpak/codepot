export const logInUser = (user) => {
	return {
		type: 'LOG_IN',
		payload: user
	}
}

export const selectProject = (project) => {
	return {
		type: 'SELECT_PROJECT',
		payload: project
	}
}
