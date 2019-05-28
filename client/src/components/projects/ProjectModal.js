import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { selectProject } from '../../actions'
import { Modal } from 'semantic-ui-react'

const ProjectModal = ({ selectedProject, selectProject }) => {
	return (
		<Modal open closeOnDimmerClick closeIcon size='fullscreen' onClose={() => selectProject(null)}>
			<Modal.Header>{selectedProject.name}</Modal.Header>
			<Modal.Content>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
					et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
					aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
					cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
					culpa qui officia deserunt mollit anim id est laborum.
				</p>
			</Modal.Content>
		</Modal>
	)
}

const mapStateToProps = (state) => {
	return {
		selectedProject: state.selectedProject
	}
}

export default connect(mapStateToProps, { selectProject })(ProjectModal)
