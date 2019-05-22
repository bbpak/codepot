import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Form, Dropdown, Button } from 'semantic-ui-react'
import ImageUploader from 'react-images-upload'
import { camelCase } from 'lodash'
import '../styles/projectform.css'

// const graphql = require('@octokit/graphql')

let reposData = {}

const ProjectForm = (props) => {
	const [ inputs, setInputs ] = useState({ user_id: props.currentUser.id })
	const [ repoOptions, setRepoOptions ] = useState([])
	const [ selectedRepo, setSelectedRepo ] = useState(null)
	const [ coverImage, setCoverImage ] = useState(null)
	const [ isLoading, setIsLoading ] = useState(true)
	const { currentUser: { username } } = props

	// Replace _, -, camelCase with whitespace for legible name
	const namify = (text) => {
		return (
			camelCase(text)
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

					// Don't include forks
					if (!repo.fork) {
						if (repos.includes(repo)) break

						repos.push({
							key: j,
							text: repo.name,
							value: repo.name
						})

						// To pre-fill form with selected repo
						reposData[repo.name] = {
							name: namify(repo.name),
							repoUrl: repo.html_url,
							language: repo.language
						}
					}
				}

				setRepoOptions(repos)

				// Done with all 3 fetch requests, set loading false
				if (i === 3) setIsLoading(false)
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
		const repo = e.target.textContent
		setSelectedRepo(repo)
		setInputs((inputs) => ({
			...reposData[repo]
		}))
	}

	const handleImageDrop = (files, URLs) => {
		console.log(files, URLs)
	}

	const handleSubmit = (e) => {
		e.preventDefault()

		// Create project
		fetch(window._API_URL_ + 'projects', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(inputs).then((res) => res.json()).then((data) => console.log(data))
		})
	}

	return (
		<div className='project-form-container'>
			<h1>New Project</h1>
			<Dropdown
				onChange={handleDropdownChange}
				value={selectedRepo}
				options={repoOptions}
				loading={isLoading}
				selection
			/>
			<Form className={!selectedRepo ? 'disabled' : ''} onSubmit={handleSubmit}>
				<div className='project-form'>
					<Form.Field className='project-form-image'>
						<label className='label'>Cover Image</label>
						<ImageUploader
							withIcon
							buttonText='Upload image'
							onChange={handleImageDrop}
							imgExtension={[ '.jpg', '.gif', '.png' ]}
							maxFileSize={5242880}
						/>
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
								value={inputs['repo_url']}
								onChange={handleInputChange}
							/>
						</Form.Field>
						<Form.Field>
							<Form.Input
								label='Project URL'
								name='projUrl'
								placeholder='project URL'
								value={inputs['project_url']}
								onChange={handleInputChange}
							/>
						</Form.Field>
					</div>
				</div>
				<div className='project-form-buttons'>
					<Button primary type='submit'>
						Create Project
					</Button>
					<Button secondary>Cancel</Button>
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
