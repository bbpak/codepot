import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Grid, Segment, Image, Message } from 'semantic-ui-react'
import Tags from '../tags/Tags'
import axios from 'axios'
import ProjectList from '../projects/ProjectList'
import '../styles/projects.css'

const Profile = ({ currentUser, match }) => {
	const [ user, setUser ] = useState(null)

	useEffect(() => {
		axios.get(window._API_URL_ + 'users/' + match.params.username).then((resp) => setUser(resp.data))
	}, [])

	if (!user)
		return (
			<Message style={{ position: 'absolute' }} negative>
				<Message.Header>User not found</Message.Header>
				<p>{`User '${match.params.username}' does not exist.`}</p>
			</Message>
		)

	return (
		<Grid className='default-bg' container doubling columns={2}>
			<Grid.Row>
				<Grid.Column width={4}>
					<Segment>
						<Image src={`https://avatars2.githubusercontent.com/u/${user.github_id}?v=4`} />
					</Segment>
				</Grid.Column>
				<Grid.Column width={12}>
					<ProjectList projects={user.projects} />
				</Grid.Column>
			</Grid.Row>
			<Grid.Row>
				<Grid.Column>{user.projects.map((project) => <Tags {...project.tags} />)}</Grid.Column>
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
