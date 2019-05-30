import React from 'react'
import { Item } from 'semantic-ui-react'
import ProjectItem from './ProjectItem'
import { connect } from 'react-redux'
import ProjectModal from './ProjectModal'
import { selectProject } from '../../actions'

const ProjectList = ({ selectProject, selectedProject, projects, usePlaceholder = false }) => {
	return (
		<div>
			{selectedProject && <ProjectModal />}
			<Item.Group className='project-list'>
				{projects &&
					projects.map((project, i) => (
						<ProjectItem selectProject={selectProject} project={project} key={i} />
					))}

				{/* THIS IS TO FORCE THE COLUMN TO ALWAYS BE FULL WIDTH EVEN WHEN EMPTY LIST */}
				{usePlaceholder && (
					<Item
						className='project-item'
						style={{ visibility: 'hidden', height: '0', padding: '0 !important' }}>
						<Item.Content>
							<Item.Description>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
								incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
								exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
							</Item.Description>
						</Item.Content>
					</Item>
				)}
			</Item.Group>
		</div>
	)
}

const mapStateToProps = (state) => {
	return {
		selectedProject: state.selectedProject
	}
}

export default connect(mapStateToProps, { selectProject })(ProjectList)
