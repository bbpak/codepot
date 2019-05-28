import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { Form, Dropdown, Button } from 'semantic-ui-react'
import ImageUploader from 'react-images-upload'
import { camelCase, filter } from 'lodash'
import axios from 'axios'
import '../styles/form.css'

let reposData = {}

const ProjectForm = (props) => {
	const [ inputs, setInputs ] = useState({ user_id: props.currentUser.id })
	const [ repoOptions, setRepoOptions ] = useState([])
	const [ tagOptions, setTagOptions ] = useState([])
	const [ selectedTags, setSelectedTags ] = useState([])
	const [ selectedRepo, setSelectedRepo ] = useState(null)
	const [ coverImage, setCoverImage ] = useState(null)
	const [ isLoading, setIsLoading ] = useState(true)
	const [ redirect, setRedirect ] = useState(false)
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

	// Make select options for tags from tags data
	const getTagOptions = (tags) => {
		return tags.map((tag) => {
			return {
				key: tag.name,
				value: tag.name,
				text: tag.name
			}
		})
	}

	useEffect(() => {
		// Use sessionStorage to avoid redundant fetches for (mostly) static data
		sessionStorage.clear()
		let repos = sessionStorage.getItem('repos')
		let allTags = sessionStorage.getItem('allTags')

		// Fetch all tags
		if (!allTags) {
			axios.get(window._API_URL_ + 'projects/tags').then((resp) => {
				sessionStorage.setItem('allTags', resp.data)
				setTagOptions(getTagOptions(resp.data))
			})
		} else {
			setTagOptions(getTagOptions(allTags))
		}

		if (!repos) {
			const reposURL = `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`
			repos = []

			// Go through 300 repos w/ 100 per page limit for FI students with a ton of labs...
			// Switch to GraphQL stretch goal 🤞
			for (let i = 1; i <= 3; i++) {
				// Fetch user's public github repos
				axios
					.get(reposURL + `&page=${i}`, { headers: { Accept: 'application/vnd.github.mercy-preview+json' } })
					.then((resp) => {
						// For-loop instead of forEach so I can break
						// Filter only relevant properties
						for (let j = 0; j < resp.data.length; j++) {
							const repo = resp.data[j]

							// Don't include forks
							if (!repo.fork) {
								if (repos.includes(repo)) break

								let languages = {}

								// Have to make ANOTHER fetch just to get the languages used
								if (repo.language) {
									axios.get(repo.languages_url).then((resp) => {
										languages = resp.data

										// Exclude languages that are a very small percentage of the codebase
										// Due to templates with lots of bloat (rails)
										// let totalLines = Object.values(languages).reduce((sum, num) => sum + num)
										// const minPercent = 0.05
										const minLines = 1200

										for (let lang in languages) {
											if (
												// languages[lang] < minPercent * totalLines ||
												languages[lang] < minLines
											) {
												delete languages[lang]
											}
										}

										let tags = [
											...Object.keys(languages).map((lang) => lang.toLowerCase()),
											...repo.topics
										]

										repos.push({
											key: j,
											text: repo.name,
											value: repo.name,
											tags: tags
										})

										// To pre-fill form with selected repo
										reposData[repo.name] = {
											name: namify(repo.name),
											repo_url: repo.html_url,
											tags: tags
										}
									})
								}
							}
						}

						setRepoOptions(repos)
						sessionStorage.setItem('repos', repos)

						// Done with all 3 fetch requests, set loading false
						if (i === 3) setIsLoading(false)
					})
			}
		} else {
			setRepoOptions(repos)
		}
	}, [])

	const handleInputChange = (e) => {
		e.persist()
		setInputs((inputs) => ({
			...inputs,
			[e.target.name]: e.target.value
		}))
	}

	const handleRepoDropdownChange = (e) => {
		const repo = e.target.textContent
		setSelectedRepo(repo)

		let inputFields = {}

		// Exclude tags array from inputs because we can't store arrays in db
		Object.keys(reposData[repo]).forEach((key) => {
			if (key !== 'tags') {
				inputFields[key] = reposData[repo][key]
			}
		})

		setInputs((inputs) => ({
			...inputFields
		}))
		setSelectedTags(reposData[repo].tags)
	}

	const handleTagDropdownChange = (e, data) => {
		setSelectedTags(data.value)
	}

	const handleCancel = () => {
		setRedirect(true)
	}

	const handleImageDrop = (files, URLs) => {
		console.log(files, URLs)
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		// Create project
		axios
			.post(window._API_URL_ + 'projects', {
				headers: {
					'Content-Type': 'application/json'
					// Authorization: `Bearer ${props.currentUser.token}`
				},
				project: inputs,
				tags: selectedTags
			})
			.then((data) => {
				setRedirect(true)
			})
	}

	const renderFormInput = (name, placeholder) => {
		return (
			<Form.Field>
				<Form.Input
					label={namify(name)}
					name={name}
					value={inputs[name]}
					placerholder={placeholder}
					onChange={handleInputChange}
				/>
			</Form.Field>
		)
	}

	const renderForm = () => {
		return (
			<React.Fragment>
				<div className='project-form animated fadeInUp'>
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
						{renderFormInput('name')}
						{renderFormInput('repo_url')}
						{renderFormInput('project_url')}
					</div>
				</div>
				<Form.Field className='tags'>
					<label className='label'>Tags</label>
					<Dropdown
						fluid
						multiple
						search
						selection
						onChange={handleTagDropdownChange}
						value={selectedTags}
						options={tagOptions}
					/>
				</Form.Field>
			</React.Fragment>
		)
	}

	return (
		<div className='project-form-container'>
			<h1>New Project</h1>
			<Dropdown
				placeholder='repository'
				onChange={handleRepoDropdownChange}
				value={selectedRepo}
				options={repoOptions}
				loading={isLoading}
				selection
			/>
			<Form>
				{selectedRepo && renderForm()}

				<div className='project-form-buttons'>
					{redirect && <Redirect to='/' />}
					<Button primary onClick={handleSubmit} type='submit'>
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
