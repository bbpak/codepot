import React from 'react'
import { Menu } from 'semantic-ui-react'
import { connect } from 'react-redux'
import LoginButton from './LoginButton'
import ProfileDropdown from './ProfileDropdown'
import '../styles/navbar.css'

const NavBar = ({ currentUser }) => {
	const isLoggedIn = !!currentUser

	return (
		<Menu id='nav-bar' secondary borderless>
			<Menu.Menu position='left'>
				<p>codepot</p>
			</Menu.Menu>
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
