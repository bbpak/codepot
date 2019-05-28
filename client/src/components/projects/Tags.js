import React from 'react'
import { Label } from 'semantic-ui-react'

const Tag = ({ name, color }) => {
	return (
		<Label className='project-tag' horizontal style={{ backgroundColor: color }}>
			{name}
		</Label>
	)
}

const Tags = ({ tags }) => {
	return <div className='project-tags'>{tags.map((tag) => <Tag {...tag} />)}</div>
}

export default Tags
