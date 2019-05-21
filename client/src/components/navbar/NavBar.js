import React from 'react'
import { Menu } from 'semantic-ui-react'
import { connect } from 'react-redux'
import LoginButton from './LoginButton'
import ProfileDropdown from './ProfileDropdown'

const NavBar = ({ currentUser }) => {
	const isLoggedIn = !!currentUser

	return (
		<Menu borderless>
			<Menu.Menu position='right'>
				<Menu.Item>{isLoggedIn ? <ProfileDropdown currentUser={currentUser} /> : <LoginButton />}</Menu.Item>
			</Menu.Menu>
		</Menu>
	)
}

const mapStateToProps = (state) => {
	return { currentUser: state.currentUser }
}

export default connect(mapStateToProps)(NavBar)
