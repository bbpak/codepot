import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Form, Dropdown, Button } from 'semantic-ui-react'
import ImageUploader from 'react-images-upload'
import '../styles/projectform.css'

const ProjectForm = (props) => {
	const [ inputs, setInputs, repos, setRepos ] = useState({})
	const { currentUser: { username, auth_token } } = props

	useEffect(() => {
		const reposURL = `https://api.github.com/users/${username}/repos/`

		// Fetch user's github repos with token
		fetch(reposURL, {}).then((res) => res.json()).then((data) => console.log(data))
	}, [])

	const handleInputChange = (e) => {
		e.persist()
		setInputs((inputs) => ({
			...inputs,
			[e.target.name]: e.target.value
		}))
	}

	const handleSubmit = (e) => {
		e.preventDefault()
	}

	return (
		<div className='project-form-container'>
			<Dropdown />
			<Form onSubmit={handleSubmit}>
				<div className='project-form'>
					<Form.Field className='project-form-image'>
						<label className='label'>Cover Image</label>
						<ImageUploader />
					</Form.Field>
					<div className='project-form-details'>
						<Form.Field>
							<Form.Input
								label='Project Name'
								name='name'
								placeholder='project name'
								value={inputs['name']}
								onChange={handleInputChange}
							/>
						</Form.Field>
						<Form.Field>
							<Form.Input
								label='Repo URL'
								name='repoUrl'
								placeholder='repository URL'
								value={inputs['repoUrl']}
								onChange={handleInputChange}
							/>
						</Form.Field>
						<Form.Field>
							<Form.Input
								label='Project URL'
								name='projUrl'
								placeholder='project URL'
								value={inputs['projUrl']}
								onChange={handleInputChange}
							/>
						</Form.Field>
					</div>
				</div>
				<div className='project-form-buttons'>
					<Button type='submit'>Create Project</Button>
				</div>
			</Form>
		</div>
	)
}

const mapStateToProps = (state) => {
	return {
		currentUser: state.currentUser
	}
}

export default connect(mapStateToProps)(ProjectForm)
