import React from 'react'
import { connect } from 'react-redux'
import { Card } from 'semantic-ui-react'
import ProjectCard from '../ProjectCard'
import { selectProject } from '../../actions'
import '../styles/projects.css'

class ProjectList extends React.Component {
	renderList() {
		return [
			{
				name: 'Test',
				project_url: 'test',
				repo_url: 'test',
				cover_image_url: 'https://react.semantic-ui.com/images/avatar/large/matthew.png',
				language: 'Ruby'
			},
			{
				name: 'Test',
				project_url: 'test',
				repo_url: 'test',
				cover_image_url: 'https://react.semantic-ui.com/images/avatar/large/matthew.png',
				language: 'Ruby'
			},
			{
				name: 'Test',
				project_url: 'test',
				repo_url: 'test',
				cover_image_url: 'https://react.semantic-ui.com/images/avatar/large/matthew.png',
				language: 'Ruby'
			},
			{
				name: 'Test',
				project_url: 'test',
				repo_url: 'test',
				cover_image_url: 'https://react.semantic-ui.com/images/avatar/large/matthew.png',
				language: 'Ruby'
			},
			{
				name: 'Test',
				project_url: 'test',
				repo_url: 'test',
				cover_image_url: 'https://react.semantic-ui.com/images/avatar/large/matthew.png',
				language: 'Ruby'
			},
			{
				name: 'Test',
				project_url: 'test',
				repo_url: 'test',
				cover_image_url: 'https://react.semantic-ui.com/images/avatar/large/matthew.png',
				language: 'Ruby'
			},
			{
				name: 'Test',
				project_url: 'test',
				repo_url: 'test',
				cover_image_url: 'https://react.semantic-ui.com/images/avatar/large/matthew.png',
				language: 'Ruby'
			},
			{
				name: 'Test',
				project_url: 'test',
				repo_url: 'test',
				cover_image_url: 'https://react.semantic-ui.com/images/avatar/large/matthew.png',
				language: 'Ruby'
			},
			{
				name: 'Test',
				project_url: 'test',
				repo_url: 'test',
				cover_image_url: 'https://react.semantic-ui.com/images/avatar/large/matthew.png',
				language: 'Ruby'
			},
			{
				name: 'Test',
				project_url: 'test',
				repo_url: 'test',
				cover_image_url: 'https://react.semantic-ui.com/images/avatar/large/matthew.png',
				language: 'Ruby'
			}
		].map((project, i) => {
			return <ProjectCard selectProject={this.props.selectProject} project={project} key={i} />
		})
	}

	render() {
		return (
			<Card.Group className='project-list'>
				{this.renderList()}
				<p>{this.props.selectedProject && this.props.selectedProject.name}</p>
			</Card.Group>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		projects: state.projects,
		selectedProject: state.selectedProject
	}
}

export default connect(mapStateToProps, { selectProject })(ProjectList)
