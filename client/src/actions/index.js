export const logInUser = (user) => {
	return {
		type: 'LOG_IN',
		payload: user
	}
}
