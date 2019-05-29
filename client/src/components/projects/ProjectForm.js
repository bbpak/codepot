import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { Form, Dropdown, Button } from 'semantic-ui-react'
import ImageUploader from 'react-images-upload'
import ReactMde from 'react-mde'
import marked from 'marked'
import { camelCase } from 'lodash'
import axios from 'axios'
import useTagsDropdown from '../tags/useTagsDropdown'
import 'react-mde/lib/styles/css/react-mde-all.css'
import '../styles/form.css'

let reposData = {}

const ProjectForm = (props) => {
	const [ isLoading, setIsLoading ] = useState(true)
	const [ repoOptions, setRepoOptions ] = useState([])
	const [ inputs, setInputs ] = useState({ user_id: props.currentUser.id })
	const [ mdeIsPreview, setMdeIsPreview ] = useState(false)
	const [ selectedRepo, setSelectedRepo ] = useState(null)
	const [ image, setImage ] = useState(null)
	const [ redirect, setRedirect ] = useState(false)
	const { currentUser: { username } } = props
	const { selectedTags, setSelectedTags, TagsDropdown } = useTagsDropdown()

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

	useEffect(() => {
		// Use sessionStorage to avoid redundant fetches for (mostly) static data
		let reposData = JSON.parse(sessionStorage.getItem('repos'))

		if (!reposData) {
			const reposURL = `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`
			reposData = {}
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
									if (repoOptions.includes(repo)) break

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
											.get(
												`https://raw.githubusercontent.com/${username}/${repo.name}/master/README.md`
											)
											.catch(() => {
												reposData[repo.name].markdown = ''
											})
											.then((resp) => {
												if (resp) {
													reposData[repo.name].markdown = resp.data
												}
											})
									)

									repoOptions.push({
										key: j,
										text: repo.name,
										value: repo.name
									})

									// To pre-fill form with selected repo
									reposData[repo.name] = {
										displayName: namify(repo.name),
										name: repo.name,
										repo_url: repo.html_url,
										description: repo.description ? repo.description : '',
										tags: tags
									}
								}
							}
						})
				)
			}

			// After all the fetches finish
			axios.all(promises).then(() => {
				setRepoOptions(repoOptions)
				sessionStorage.setItem('repos', JSON.stringify(reposData))
				setIsLoading(false)
			})
		} else {
			let options = []
			for (let repo in reposData) {
				options.push({
					key: reposData[repo].name,
					text: reposData[repo].name,
					value: reposData[repo].name
				})
			}
			console.log(options)
			setRepoOptions(options)
			setIsLoading(false)
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

		// Exclude tags array from inputs because we can't store arrays in db
		for (let key in reposData[repo]) {
			if (key !== 'tags') {
				inputFields[key] = reposData[repo][key]
			}
		}

		setInputs((inputs) => ({
			...inputFields
		}))
		setSelectedTags(JSON.parse(sessionStorage.repos).tags)
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
					<TagsDropdown tagOptions={props.tagOptions} />
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
		currentUser: state.currentUser,
		tagOptions: state.tagOptions
	}
}

export default connect(mapStateToProps)(ProjectForm)
