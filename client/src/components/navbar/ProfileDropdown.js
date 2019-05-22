import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { setCurrentUser } from '../../actions'

const ProfileDropdown = ({ currentUser, setCurrentUser }) => {
	const handleSignOut = () => {
		// Clear cookie for user object
		document.cookie = 'current_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
		setCurrentUser(null)
	}

	const trigger = (
		<div className='profile-dd'>
			<span>{currentUser.username}</span>
			<img src={`https://avatars2.githubusercontent.com/u/${currentUser.github_id}?v=4`} alt='avatar' />
		</div>
	)

	const options = [ { key: 'sign-out', text: 'Sign Out', icon: 'sign out', onClick: handleSignOut } ]

	return <Dropdown trigger={trigger} options={options} icon={null} />
}

const mapStateToProps = (state) => {
	return {
		currentUser: state.currentUser
	}
}
export default connect(mapStateToProps, { setCurrentUser })(ProfileDropdown)
