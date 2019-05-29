import React, { useState } from 'react'
import { Dropdown } from 'semantic-ui-react'

const useTagsDropdown = () => {
	const [ selectedTags, setSelectedTags ] = useState([])

	const handleTagsChange = (e, data) => {
		setSelectedTags(data.value)
	}

	return {
		selectedTags,
		setSelectedTags,
		handleTagsChange
	}
}

export default useTagsDropdown
