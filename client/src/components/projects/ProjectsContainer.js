import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Card } from 'semantic-ui-react'
import axios from 'axios'
import ProjectItem from './ProjectItem'
import { selectProject, setProjects } from '../../actions'
import '../styles/projects.css'

const ProjectsContainer = (props) => {
	useEffect(() => {
		// Fetch all projects for now, set limits if there are a lot
		axios.get(window._API_URL_ + 'projects').then((resp) => {
			props.setProjects(resp.data)
		})
	}, [])

	return (
		<React.Fragment>
			<div className='project-filter'>THING</div>
			<Card.Group className='project-list'>
				{props.projects.map((project, i) => (
					<ProjectItem selectProject={props.selectProject} project={project} key={i} />
				))}
			</Card.Group>
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
