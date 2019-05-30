import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Input, Grid, Item, Dropdown } from 'semantic-ui-react'
import { includes, filter, difference } from 'lodash'
import axios from 'axios'
import ProjectItem from './ProjectItem'
import ProjectModal from './ProjectModal'
import { selectProject, setProjects } from '../../actions'
import '../styles/projects.css'
import useFormInput from '../forms/useFormInput'
import useTagsDropdown from '../tags/useTagsDropdown'

const ProjectsContainer = (props) => {
	const [ results, setResults ] = useState(props.projects)
	const [ dropdownTags, setDropdownTags ] = useState([])
	const { inputs, handleInputChange } = useFormInput()
	const { selectedTags, setSelectedTags, handleTagsChange } = useTagsDropdown()

	useEffect(
		() => {
			console.log(selectedTags)
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
			{props.selectedProject && <ProjectModal />}
			<Grid fluid doubling columns={2}>
				<Grid.Column width={4} className='project-filter'>
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
				</Grid.Column>
				<Grid.Column width={12}>
					<Item.Group className='project-list'>
						{results &&
							results.map((project, i) => (
								<ProjectItem selectProject={props.selectProject} project={project} key={i} />
							))}

						{/* THIS IS TO FORCE THE COLUMN TO ALWAYS BE FULL WIDTH EVEN WHEN EMPTY LIST */}
						<Item className='project-item' style={{ visibility: 'hidden' }}>
							<Item.Content>
								<Item.Description>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
									incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
									exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
									irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
									pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
									deserunt mollit anim id est laborum.
								</Item.Description>
							</Item.Content>
						</Item>
					</Item.Group>
				</Grid.Column>
			</Grid>
		</React.Fragment>
	)
}

const mapStateToProps = (state) => {
	return {
		projects: state.projects,
		tagOptions: state.tagOptions,
		selectedProject: state.selectedProject
	}
}

export default connect(mapStateToProps, { selectProject, setProjects })(ProjectsContainer)
