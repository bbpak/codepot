import React from 'react'

const Project = (props) => {
	return <div onClick={() => props.selectProject(props.project)}>{props.project.name}</div>
}

export default Project
