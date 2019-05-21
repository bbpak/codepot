import React from 'react'
import { Menu } from 'semantic-ui-react'
import LoginButton from './forms/LoginButton'

const NavBar = (props) => {
	return (
		<Menu borderless>
			<Menu.Menu position='right'>
				<Menu.Item>
					<LoginButton />
				</Menu.Item>
			</Menu.Menu>
		</Menu>
	)
}

export default NavBar
