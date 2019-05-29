import React, { useState } from 'react'

const useFormInput = () => {
	const [ inputs, setInputs ] = useState({})

	const handleInputChange = (e) => {
		e.persist()
		setInputs({ ...inputs, [e.target.name]: e.target.value })
	}

	return {
		inputs,
		setInputs,
		handleInputChange
	}
}

export default useFormInput
