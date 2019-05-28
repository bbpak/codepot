import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { Form, Dropdown, Button } from 'semantic-ui-react'
import ImageUploader from 'react-images-upload'
import ReactMde from 'react-mde'
import marked from 'marked'
import { camelCase, filter } from 'lodash'
import axios from 'axios'
import 'react-mde/lib/styles/css/react-mde-all.css'
import '../styles/form.css'

let reposData = {}

const ProjectForm = (props) => {
	const [ isLoading, setIsLoading ] = useState(true)
	const [ repoOptions, setRepoOptions ] = useState([])
	const [ inputs, setInputs ] = useState({ user_id: props.currentUser.id })
	const [ mdeIsPreview, setMdeIsPreview ] = useState(false)
	const [ tagOptions, setTagOptions ] = useState([])
	const [ selectedTags, setSelectedTags ] = useState([])
	const [ selectedRepo, setSelectedRepo ] = useState(null)
	const [ image, setImage ] = useState(null)
	const [ redirect, setRedirect ] = useState(false)
	const { currentUser: { username } } = props

	// Replace _, -, camelCase with whitespace for legible name
	const namify = (text) => {
		console.log('namify')
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
		console.log('tag-ops')
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
			let promises = []

			// Go through 300 repos w/ 100 per page limit for FI students with a ton of labs...
			// Switch to GraphQL stretch goal 🤞
			for (let i = 1; i <= 3; i++) {
				// Fetch user's public github repos
				promises.push(
					axios
						.get(reposURL + `&page=${i}`, {
							headers: { Accept: 'application/vnd.github.mercy-preview+json' }
						})
						.then((resp) => {
							// For-loop instead of forEach so I can break
							// Filter only relevant properties
							for (let j = 0; j < resp.data.length; j++) {
								const repo = resp.data[j]

								// Don't include forks
								if (!repo.fork) {
									if (repos.includes(repo)) break

									let tags = []
									let languages = {}

									// Have to make another fetch just to get the languages used
									if (repo.language) {
										promises.push(
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

												tags = [
													...Object.keys(languages).map((lang) => lang.toLowerCase()),
													...repo.topics
												]
											})
										)
									}

									// Another fetch to get the readme
									promises.push(
										axios
											.get(`https://raw.githubusercontent.com/${repo.full_name}/master/README.md`)
											.catch(() => {
												reposData[repo.name].markdown = ''
											})
											.then((resp) => {
												if (resp) {
													reposData[repo.name].markdown = resp.data
												}
											})
									)

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
										description: repo.description ? repo.description : '',
										full_name: repo.full_name,
										tags: tags
									}
								}
							}
						})
				)
			}

			// After all the fetches finish
			axios.all(promises).then(() => {
				setRepoOptions(repos)
				sessionStorage.setItem('repos', repos)
				setIsLoading(false)
			})
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
		console.log('repo change')
		const repo = e.target.textContent
		setSelectedRepo(repo)

		let inputFields = {}
		console.log(reposData)

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
		console.log('tag change')
		setSelectedTags(data.value)
	}

	const handleCancel = () => {
		setRedirect(true)
	}

	const handleImageDrop = (files, URLs) => {
		console.log(files, URLs)
	}

	const handleSubmit = (e) => {
		console.log('submit')
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

	const renderFormInput = (name, type = 'text') => {
		console.log('render input')
		let input = null
		if (type === 'textarea') {
			input = (
				<Form.TextArea
					maxLength={500}
					label={namify(name)}
					name={name}
					value={inputs[name]}
					onChange={handleInputChange}
				/>
			)
		} else if (type === 'text') {
			input = <Form.Input label={namify(name)} name={name} value={inputs[name]} onChange={handleInputChange} />
		} else if (type === 'mde') {
			console.log(inputs[name])
			input = (
				<React.Fragment>
					<label className='label'>{namify(name)}</label>
					<ReactMde
						value={inputs[name]}
						onChange={handleInputChange}
						onTabChange={() => setMdeIsPreview(!mdeIsPreview)}
						selectedTab={mdeIsPreview ? 'preview' : 'write'}
						generateMarkdownPreview={(md) => Promise.resolve(marked(md))}
					/>
				</React.Fragment>
			)
		}

		return <Form.Field>{input}</Form.Field>
	}

	const renderForm = () => {
		return (
			<React.Fragment>
				<div className='project-form'>
					{/* animated fadeInUp'> */}
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
						{renderFormInput('short description', 'textarea')}
						{renderFormInput('markdown', 'mde')}
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
