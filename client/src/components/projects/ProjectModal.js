import React, { useState, useEffect } from 'react'
import axios from 'axios'
import marked from 'marked'
import { connect } from 'react-redux'
import { selectProject } from '../../actions'
import { Modal, Image } from 'semantic-ui-react'
import { getHtml } from './markdownHelper'

const ProjectModal = ({ selectedProject, selectProject }) => {
	const [ projectReadme, setProjectReadme ] = useState(false)

	const image = selectedProject.image_url
		? selectedProject.image_url
		: 'https://react.semantic-ui.com/images/wireframe/image.png'

	return (
		<Modal open closeOnDimmerClick closeIcon size='fullscreen' onClose={() => selectProject(null)}>
			<Modal.Header>{selectedProject.name}</Modal.Header>
			<Modal.Content image>
				<Image size='large' wrapped src={image} />
				{projectReadme && <div dangerouslySetInnerHTML={projectReadme} className='project-readme' />}
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
