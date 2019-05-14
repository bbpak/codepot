import React from 'react'
import { connect } from 'react-redux'
import Project from '../Project'
import { selectProject } from '../../actions'

class ProjectList extends React.Component {
	renderList() {
		return this.props.projects.map((project, i) => {
			return <Project selectProject={this.props.selectProject} project={project} key={i} />
		})
	}

	render() {
		console.log(this.props)
		return (
			<div>
				{this.renderList()}
				<p>{this.props.selectedProject && this.props.selectedProject.name}</p>
			</div>
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
