import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Grid, Item, Form } from 'semantic-ui-react'
import axios from 'axios'
import ProjectItem from './ProjectItem'
import ProjectModal from './ProjectModal'
import { selectProject, setProjects } from '../../actions'
import useTagsDropdown from '../tags/useTagsDropdown'
import '../styles/projects.css'
import SearchForm from './SearchForm'

const ProjectsContainer = (props) => {
	useEffect(() => {
		// Fetch all projects for now, set limits if there are a lot
		axios.get(window._API_URL_ + 'projects').then((resp) => {
			props.setProjects(resp.data)
		})
	}, [])

	return (
		<React.Fragment>
			{props.selectedProject && <ProjectModal />}
			<Grid doubling columns={2}>
				<Grid.Column width={4} className='project-filter'>
					<SearchForm />
				</Grid.Column>
				<Grid.Column width={12}>
					<Item.Group className='project-list'>
						{props.projects.map((project, i) => (
							<ProjectItem selectProject={props.selectProject} project={project} key={i} />
						))}
					</Item.Group>
				</Grid.Column>
			</Grid>
		</React.Fragment>
	)
}

const mapStateToProps = (state) => {
	return {
		projects: state.projects,
		selectedProject: state.selectedProject
	}
}

export default connect(mapStateToProps, { selectProject, setProjects })(ProjectsContainer)
