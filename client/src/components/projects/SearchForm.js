import React from 'react'
import { connect } from 'react-redux'
import { Form } from 'semantic-ui-react'
import useTagsDropdown from '../tags/useTagsDropdown'

const SearchForm = (props) => {
	const { selectedTags, setSelectedTags, TagsDropdown } = useTagsDropdown()

	return (
		<Form>
			<Form.Field>
				<Form.Input fluid label='Search' icon='search' />
			</Form.Field>
			<Form.Field>
				<label>Tags</label>
				<TagsDropdown tagOptions={props.tagOptions} />
			</Form.Field>
		</Form>
	)
}

const mapStateToProps = (state) => {
	return {
		tagOptions: state.tagOptions
	}
}

export default connect(mapStateToProps)(SearchForm)
