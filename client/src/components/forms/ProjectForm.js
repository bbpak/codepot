import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Form, Dropdown, Button } from 'semantic-ui-react'
import ImageUploader from 'react-images-upload'
import '../styles/projectform.css'

// const graphql = require('@octokit/graphql')

const ProjectForm = (props) => {
	const [ inputs, setInputs ] = useState({})
	const [ repos, setRepos ] = useState([])
	const [ selectedRepo, setSelectedRepo ] = useState(null)
	const { currentUser: { username } } = props

	// Replace _, -, camelCase with whitespace for legible name
	const namify = (text) => {
		return (
			text
				// replace - and _
				.replace(/([-|_])/g, ' ')
				// insert a space before all caps
				.replace(/([A-Z])/g, ' $1')
				// uppercase the first character
				.replace(/^./, function(str) {
					return str.toUpperCase()
				})
		)
	}

	useEffect(() => {
		const reposURL = `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`
		let repos = []

		// Go through 300 repos, 100 per page limit
		// For FI students with a ton of labs... Switch to GraphQL stretch goal
		for (let i = 1; i <= 3; i++) {
			// Fetch user's public github repos
			fetch(reposURL + `&page=${i}`).then((res) => res.json()).then((data) => {
				// For-loop instead of forEach so I can break
				// Filter only relevant properties
				for (let j = 0; j < data.length; j++) {
					const repo = data[j]
					if (!repo.fork) {
						if (repos.includes(repo)) break

						repos.push({
							key: j,
							text: repo.name,
							value: repo.name,
							data: {
								name: namify(repo.name),
								repoUrl: repo.html_url,
								language: repo.language
							}
						})
					}
				}

				// Don't include forks
				setRepos(repos)
			})
		}
	}, [])

	const handleInputChange = (e) => {
		e.persist()
		setInputs((inputs) => ({
			...inputs,
			[e.target.name]: e.target.value
		}))
	}

	const handleDropdownChange = (e) => {
		setSelectedRepo(e.target.value)
	}

	const handleSubmit = (e) => {
		e.preventDefault()
	}
	return (
		<div className='project-form-container'>
			<Dropdown onChange={handleDropdownChange} options={repos} loading={!repos} />
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
