import React from 'react'
import { Popup } from 'semantic-ui-react'

const ProjectTag = ({ language }) => {
	return (
		<Popup
			content={language}
			position='top left'
			trigger={<i className={`devicon-${language.toLowerCase()}-plain colored`} />}
		/>
	)
}

export default ProjectTag
