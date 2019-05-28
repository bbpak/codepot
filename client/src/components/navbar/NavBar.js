import React from 'react'
import { Menu } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import LoginButton from './LoginButton'
import ProfileDropdown from './ProfileDropdown'
import logo from '../../logo.png'
import '../styles/navbar.css'

const NavBar = ({ currentUser }) => {
	const isLoggedIn = !!currentUser

	return (
		<Menu id='nav-bar' secondary borderless>
			<Link to='/' className='logo'>
				<img src={logo} alt='logo' />
			</Link>
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
