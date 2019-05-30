import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Grid, Segment, Image } from 'semantic-ui-react'
import Tags from '../tags/Tags'
import axios from 'axios'

const Profile = ({ currentUser, match }) => {
	const [ user, setUser ] = useState(null)

	useEffect(() => {
		axios.get(window._API_URL_ + 'users/' + match.params.username).then((resp) => setUser(resp.data))
	}, [])

	if (!user) return <div>user does not exist!</div>

	return (
		<Grid className='default-bg' container doubling columns={2}>
			<Grid.Row>
				<Grid.Column width={4}>
					<Segment>
						<Image src={`https://avatars2.githubusercontent.com/u/${user.github_id}?v=4`} />
					</Segment>
				</Grid.Column>
				<Grid.Column width={12}>
					<Segment>ABOUT ME</Segment>
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
