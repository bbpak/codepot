import React from 'react'
import { Label } from 'semantic-ui-react'

const Tag = ({ name, color }) => {
	return (
		<Label className='project-tag' horizontal style={{ backgroundColor: color }}>
			<span>{name}</span>
		</Label>
	)
}

const Tags = ({ tags }) => {
	if (!tags) return null
	return <div className='project-tags'>{tags.map((tag, i) => <Tag key={i} {...tag} />)}</div>
}

export default Tags
