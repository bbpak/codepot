import React from 'react'
import { Item } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { selectProject } from '../../actions'
import Tags from './Tags'

const ProjectItem = (props) => {
	const image = props.project.image_url
		? props.project.image_url
		: 'https://react.semantic-ui.com/images/wireframe/image.png'

	return (
		<Item className='project-item' onClick={() => props.selectProject(props.project)}>
			<Item.Image size='medium' src={image} />
			<Item.Content>
				<Item.Header>{props.project.name}</Item.Header>
				<Item.Description>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
					et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
					aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
					cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
					culpa qui officia deserunt mollit anim id est laborum.
				</Item.Description>
				<Item.Extra>
					<Tags {...props.project} />
				</Item.Extra>
			</Item.Content>
		</Item>
	)
}

export default connect(undefined, { selectProject })(ProjectItem)
