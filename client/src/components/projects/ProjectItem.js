import React from 'react'
import { Container, Item } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { selectProject } from '../../actions'
import Tags from '../tags/Tags'

const ProjectItem = (props) => {
	if (!props.project) return null

	const image = props.project.image_url ? props.project.image_url : window._CLOUD_URL_ + 'n2tu5yh7jo6xojjwonic'

	return (
		<Item className='project-item' onClick={() => props.selectProject(props.project)}>
			<Item.Image size='medium' src={image} />
			<Item.Content>
				<Item.Header>{props.project.name}</Item.Header>
				<Item.Description>{props.project.description}</Item.Description>
				<Item.Extra>
					<Tags {...props.project} />
				</Item.Extra>
			</Item.Content>
		</Item>
	)
}

export default connect(undefined, { selectProject })(ProjectItem)
