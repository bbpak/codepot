import React from 'react'
import { Card, Image, Icon } from 'semantic-ui-react'

const ProjectItem = (props) => {
	return (
		<Card fluid className='project-item' onClick={() => props.selectProject(props.project)}>
			<Image src={props.project.cover_image_url} wrapped ui={false} />
			<Card.Content>
				<Card.Header>{props.project.name}</Card.Header>
			</Card.Content>
			<Card.Content extra>
				<Icon name='user' />
				1 Like
				<span className='languages'>
					<i
						title={props.project.language}
						className={`devicon-${props.project.language.toLowerCase()}-plain colored`}
					/>
				</span>
			</Card.Content>
		</Card>
	)
}

export default ProjectItem
