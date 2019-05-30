import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Grid, Segment, Image, Message, Loader } from 'semantic-ui-react'
import { uniqBy, countBy } from 'lodash'
import Tags from '../tags/Tags'
import axios from 'axios'
import ProjectList from '../projects/ProjectList'
import '../styles/projects.css'

const Profile = ({ currentUser, match }) => {
	const [ user, setUser ] = useState(null)
	const [ isLoading, setIsLoading ] = useState(true)

	useEffect(() => {
		axios.get(window._API_URL_ + 'users/' + match.params.username).then((resp) => {
			setUser(resp.data)
			setIsLoading(false)
		})
	}, [])

	if (isLoading) {
		return <Loader />
	}

	if (!user) {
		return (
			<Message style={{ position: 'absolute' }} negative>
				<Message.Header>User not found</Message.Header>
				<p>{`User '${match.params.username}' does not exist.`}</p>
			</Message>
		)
	}

	const getUserTags = () => {
		let allTags = []
		user.projects.forEach((project) => {
			allTags = [ ...allTags, ...project.tags ]
		})

		return uniqBy(allTags, 'name')
	}

	const getUserTagCounts = () => {
		if (!user.projects) return
		let allTags = []
		user.projects.forEach((project) => {
			allTags = [ ...allTags, ...project.tags ]
		})

		return countBy(allTags, 'name')
	}

	return (
		<Grid className='default-bg profile' container doubling columns={2}>
			<Grid.Row>
				<Grid.Column width={4}>
					<Segment>
						<Image src={`https://avatars2.githubusercontent.com/u/${user.github_id}?v=4`} />
						<h2>{user.username}</h2>
					</Segment>
					<Segment>
						<Tags tags={getUserTags()} counts={getUserTagCounts()} />
					</Segment>
				</Grid.Column>
				<Grid.Column width={12}>
					<div className='project-list-container'>
						<ProjectList projects={user.projects} />
					</div>
				</Grid.Column>
			</Grid.Row>
		</Grid>
	)
}

const mapStateToProps = (state) => {
	return {
		currentUser: state.currentUser
	}
}

export default connect(mapStateToProps)(Profile)
