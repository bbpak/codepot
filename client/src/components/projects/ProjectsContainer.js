import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Input, Grid, Item, Dropdown } from 'semantic-ui-react'
import { includes, filter, difference } from 'lodash'
import { setProjects } from '../../actions'
import ProjectList from './ProjectList'
import useFormInput from '../forms/useFormInput'
import useTagsDropdown from '../tags/useTagsDropdown'
import '../styles/projects.css'

const ProjectsContainer = (props) => {
	const [ results, setResults ] = useState(props.projects)
	const [ dropdownTags, setDropdownTags ] = useState([])
	const { inputs, handleInputChange } = useFormInput()
	const { selectedTags, setSelectedTags, handleTagsChange } = useTagsDropdown()

	useEffect(
		() => {
			window.scrollTo(0, 0)

			if (!inputs['search']) {
				setResults(props.projects)

				if (selectedTags.length > 0) {
					handleFilterByTag()
				}
			} else {
				handleFilterBySearch()
			}
		},
		[ inputs, props.projects, selectedTags ]
	)

	const handleFilterBySearch = () => {
		setResults(
			filter(results, (project) => {
				return includes(project.display_name.toLowerCase(), inputs['search'].toLowerCase())
			})
		)
	}

	const handleFilterByTag = () => {
		setResults(
			filter(results, (project) => {
				return difference(selectedTags, project.tags.map((tag) => tag.name)).length === 0
			})
		)
	}

	const getTagOptions = (tags) => {
		return tags.map((tag) => ({
			key: tag,
			text: tag,
			value: tag
		}))
	}

	const handleSearchChange = (e, data, handleChange) => {
		handleChange(e, data)
	}

	return (
		<React.Fragment>
			<Grid doubling columns={2}>
				<Grid.Column width={4}>
					<div className='project-filter'>
						<Input
							fluid
							name='search'
							placeholder='project name'
							value={inputs['search']}
							onChange={(e, data) => handleSearchChange(e, data, handleInputChange)}
							icon='search'
						/>
						<Dropdown
							fluid
							multiple
							search
							selection
							placeholder='tags'
							onChange={(e, data) => handleSearchChange(e, data, handleTagsChange)}
							value={selectedTags}
							onBlur={() => setDropdownTags(getTagOptions(selectedTags))}
							onFocus={() => setDropdownTags(props.tagOptions)}
							options={dropdownTags}
						/>
					</div>
					<div style={{ visibility: 'hidden' }}>
						<Input fluid />
						<Dropdown fluid options={[]} />
					</div>
				</Grid.Column>
				<Grid.Column width={12}>
					<Item.Group className='project-list'>
						<ProjectList projects={results} usePlaceholder />
					</Item.Group>
				</Grid.Column>
			</Grid>
		</React.Fragment>
	)
}

const mapStateToProps = (state) => {
	return {
		projects: state.projects,
		tagOptions: state.tagOptions
	}
}

export default connect(mapStateToProps, { setProjects })(ProjectsContainer)
