import React, { useState, useEffect } from 'react'
import axios from 'axios'
import marked from 'marked'
import { connect } from 'react-redux'
import { selectProject } from '../../actions'
import { Modal, Image } from 'semantic-ui-react'
import { getHtml } from '../helpers/formHelper'
import { Link } from 'react-router-dom'

import '../styles/github-md.css'
import Tags from '../tags/Tags'

const ProjectModal = ({ selectedProject, selectProject }) => {
	const [ projectReadme, setProjectReadme ] = useState(false)

	const image = selectedProject.image_id
		? window._CLOUD_URL_ + selectedProject.image_id
		: window._CLOUD_URL_ + 'n2tu5yh7jo6xojjwonic'

	const markdown = selectedProject.markdown ? getHtml(marked(selectedProject.markdown)) : { __html: '' }

	return (
		<Modal open closeOnDimmerClick closeIcon size='fullscreen' onClose={() => selectProject(null)}>
			<Modal.Header>{selectedProject.display_name}</Modal.Header>
			<Modal.Content image>
				<div>
					<Image size='large' wrapped src={image} />
					<p>
						Owner:{' '}
						<strong>
							<Link to={`/${selectedProject.owner}`}>{selectedProject.owner}</Link>
						</strong>
					</p>
					<Tags {...selectedProject} />
				</div>
				<Modal.Description>
					{projectReadme && <div dangerouslySetInnerHTML={projectReadme} className='project-readme' />}
					<div className='markdown-container' dangerouslySetInnerHTML={markdown} />
				</Modal.Description>
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
