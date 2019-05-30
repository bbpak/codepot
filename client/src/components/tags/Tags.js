import React from 'react'
import { Label } from 'semantic-ui-react'
import { sortBy } from 'lodash'

const Tag = ({ name, color, count }) => {
	return (
		<Label className='project-tag' horizontal style={{ backgroundColor: color }}>
			<span>{name}</span>
			{count && <Label.Detail>{count}</Label.Detail>}
		</Label>
	)
}

const Tags = ({ tags, counts }) => {
	if (!tags) return null
	tags = sortBy(tags, (tag) => tag.name)

	return (
		<div className='project-tags'>
			{tags.map((tag, i) => <Tag key={i} {...tag} count={counts ? counts[tag.name] : null} />)}
		</div>
	)
}

export default Tags
