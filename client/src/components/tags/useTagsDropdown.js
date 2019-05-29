import React, { useState } from 'react'
import { Dropdown } from 'semantic-ui-react'

const useTagsDropdown = () => {
	const [ selectedTags, setSelectedTags ] = useState([])

	const handleTagsChange = (e, data) => {
		setSelectedTags(data.value)
	}

	const TagsDropdown = ({ tagOptions }) => {
		return (
			<Dropdown
				fluid
				multiple
				search
				selection
				onChange={handleTagsChange}
				value={selectedTags}
				options={tagOptions}
			/>
		)
	}

	return {
		selectedTags,
		setSelectedTags,
		TagsDropdown
	}
}

export default useTagsDropdown
