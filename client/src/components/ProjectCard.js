import React from 'react'
import { Card, Image, Icon } from 'semantic-ui-react'

const ProjectCard = (props) => {
	return (
		<Card onClick={() => props.selectProject(props.project)}>
			<Image src={props.project.cover_image_url} wrapped ui={false} />
			<Card.Content>
				<Card.Header>{props.project.name}</Card.Header>
			</Card.Content>
			<Card.Content extra>
				<Icon name='user' />
				1 Like
				<i className={`devicon-${props.project.language.toLowerCase()}-plain colored`} />
			</Card.Content>
		</Card>
	)
}

export default ProjectCard
