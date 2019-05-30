import React from 'react'
import { Dropdown, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { setCurrentUser } from '../../actions'

const ProfileDropdown = ({ currentUser, setCurrentUser }) => {
	const handleSignOut = () => {
		// Clear cookie for user object
		document.cookie = 'current_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
		setCurrentUser(null)
		sessionStorage.clear()
	}

	const trigger = (
		<div className='profile-dd'>
			<span>{currentUser.username}</span>
			<img src={`https://avatars2.githubusercontent.com/u/${currentUser.github_id}?v=4`} alt='avatar' />
		</div>
	)

	return (
		<Dropdown trigger={trigger} icon={null}>
			<Dropdown.Menu>
				<Link to={`/${currentUser.username}`}>
					<Dropdown.Item>
						<Icon name='user' />&nbsp;&nbsp;&nbsp;Profile
					</Dropdown.Item>
				</Link>

				<Dropdown.Item onClick={handleSignOut}>
					<Icon name='sign out' /> Sign Out
				</Dropdown.Item>
			</Dropdown.Menu>
		</Dropdown>
	)
}

const mapStateToProps = (state) => {
	return {
		currentUser: state.currentUser
	}
}
export default connect(mapStateToProps, { setCurrentUser })(ProfileDropdown)
