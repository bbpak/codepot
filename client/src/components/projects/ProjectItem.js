import React from 'react'
import { Card, Image, Icon } from 'semantic-ui-react'
import Tags from './Tags'

const ProjectItem = (props) => {
	return (
		<Card fluid className='project-item' onClick={() => props.selectProject(props.project)}>
			<Image src={props.project.cover_image_url} wrapped ui={false} />
			<Card.Content>
				<Card.Header>{props.project.name}</Card.Header>
			</Card.Content>
			<Card.Content extra style={{ backgroundColor: 'black' }}>
				<Tags {...props.project} />
			</Card.Content>
		</Card>
	)
}

export default ProjectItem
