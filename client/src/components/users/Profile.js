import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Grid, Segment, Image } from 'semantic-ui-react'
import axios from 'axios'

const Profile = ({ currentUser, match }) => {
	const [ user, setUser ] = useState(null)

	useEffect(() => {
		axios.get(window._API_URL_ + 'users/' + match.params.username).then((resp) => setUser(resp.data))
	}, [])

	if (!user) return null

	return (
		<Grid>
			<Grid.Column />
			<Segment>
				<Image src={`https://avatars2.githubusercontent.com/u/${user.github_id}?v=4`} />
			</Segment>
			<Grid.Column />
		</Grid>
	)
}

const mapStateToProps = (state) => {
	return {
		currentUser: state.currentUser
	}
}

export default connect(mapStateToProps)(Profile)
