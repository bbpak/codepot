import React from 'react'
import { connect } from 'react-redux'
import { Card } from 'semantic-ui-react'
import ProjectItem from './ProjectItem'
import { selectProject } from '../../actions'
import '../styles/projects.css'

const ProjectsContainer = (props) => {
	const renderList = () => {
		return props.projects.map((project, i) => {
			return <ProjectItem selectProject={props.selectProject} project={project} key={i} />
		})
	}

	return (
    <>
      <div className='project-filter'>THING</div>
      <Card.Group className='project-list'>{renderList()}</Card.Group>
    </>
  )
}

const mapStateToProps = (state) => {
	return {
		projects: state.projects,
		selectedProject: state.selectedProject
	}
}

export default connect(mapStateToProps, { selectProject })(ProjectsContainer)
