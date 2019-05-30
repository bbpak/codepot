import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { Form, Dropdown, Button } from 'semantic-ui-react'
import axios from 'axios'
import marked from 'marked'
import { getHtml, namify } from '../helpers/formHelper'
import useTagsDropdown from '../tags/useTagsDropdown'
import useFormInput from './useFormInput'
import ImageUploader from 'react-images-upload'
import ReactMde from 'react-mde'
import '../styles/form.css'
import 'react-mde/lib/styles/css/react-mde-all.css'

const ProjectForm = (props) => {
	const [ isLoading, setIsLoading ] = useState(true)
	const [ repoOptions, setRepoOptions ] = useState([])
	const [ repoData, setRepoData ] = useState({})
	const [ selectedRepo, setSelectedRepo ] = useState(null)
	const [ redirect, setRedirect ] = useState(false)
	const [ dropdownTags, setDropdownTags ] = useState([])
	const [ markdownText, setMarkdownText ] = useState('')
	const [ mdeIsPreview, setMdeIsPreview ] = useState(false)
	const [ imageUrl, setImageUrl ] = useState('')
	const [ imageFile, setImageFile ] = useState(null)

	const { currentUser } = props

	// Custom hooks
	const { selectedTags, setSelectedTags, handleTagsChange } = useTagsDropdown()
	const { inputs, setInputs, handleInputChange } = useFormInput()

	const loadAllReposData = (repos) => {
		let options = repoOptions

		if (!(options.size > 0)) {
			for (let repo in repos) {
				options.push({
					key: repos[repo].name,
					text: repos[repo].name,
					value: repos[repo].name
				})
			}
		}

		setRepoData(repos)
		setRepoOptions(options)
		setIsLoading(false)
	}

	// Make multiple fetches to grab all repositories
	useEffect(() => {
		// Use sessionStorage to avoid redundant fetches for (mostly) static data
		let repos = JSON.parse(sessionStorage.getItem('repos'))

		// ONLY DO FETCHES IF NOTHING IN SESSION STORAGE
		if (!repos) {
			const reposURL = `https://api.github.com/users/${currentUser.username}/repos?sort=updated&per_page=100`
			repos = {}
			let promises = []
			let promisesOfPromises = [] // Yes it's ridiculous

			// Go through 300 repos w/ 100 per page limit for FI students with a ton of labs...
			// Switch to GraphQL stretch goal 🤞 (still 100 per page limit)
			for (let i = 1; i <= 3; i++) {
				// Fetch user's public github repos
				promisesOfPromises.push(
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

									// To pre-fill form with selected repo
									repos[repo.name] = {
										display_name: namify(repo.name),
										name: repo.name,
										repo_url: repo.html_url,
										description: repo.description ? repo.description : ''
									}

									// Fetches within fetches using data from outer fetches

									// Get languages used and any topics
									let languages = {}
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

											const tags = [
												...Object.keys(languages).map((lang) => lang.toLowerCase()),
												...repo.topics
											]

											repos[repo.name].tags = tags
										})
									)

									// Get readme markdown
									promises.push(
										axios
											.get(
												`https://raw.githubusercontent.com/${currentUser.username}/${repo.name}/master/README.md`
											)
											.catch(() => '')
											.then((resp) => {
												if (resp) repos[repo.name].markdown = resp.data
												else repos[repo.name].markdown = ''
											})
									)
								}
							}
							return axios.all(promises)
						})
				)
			}
			// After all the fetches finish
			axios.all(promisesOfPromises).then(() => {
				sessionStorage.setItem('repos', JSON.stringify(repos))
				loadAllReposData(repos)
			})
		} else {
			loadAllReposData(repos)
		}
	}, [])

	const getTagOptions = (tags) => {
		return tags.map((tag) => ({
			key: tag,
			text: tag,
			value: tag
		}))
	}

	const handleRepoDropdownChange = (e) => {
		const repo = e.target.textContent

		setSelectedRepo(repo)

		let inputFields = {}

		// Get just input fields
		for (let key in repoData[repo]) {
			if (key !== 'tags' && key !== 'markdown') {
				inputFields[key] = repoData[repo][key]
			}
		}

		setInputs(inputFields)

		// This is to prevent loading 350+ tags on every re-render
		setDropdownTags(getTagOptions(repoData[repo].tags))
		setSelectedTags(repoData[repo].tags)
	}

	const handleUploadImage = (files, URLs) => {
		setImageUrl(URLs[URLs.length - 1])
		setImageFile(files[files.length - 1])
	}

	const handleMarkdownChange = (val) => {
		setMarkdownText(val)
	}

	const handleCancel = () => {
		setRedirect(true)
	}

	const handleSubmit = (e) => {
		e.preventDefault()

		if (imageFile) {
			// Upload image to cloudinary
			const formData = new FormData()
			formData.append('file', imageFile)
			formData.append('api_key', process.env.REACT_APP_CLOUD_API_KEY)
			formData.append('upload_preset', 'encmp24r')
			formData.append('timestamp', (Date.now() / 1000) | 0)
			return axios
				.post(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`, formData, {
					headers: { 'X-Requested-With': 'XMLHttpRequest' }
				})
				.then((resp) => {
					// Create project
					axios
						.post(window._API_URL_ + 'projects', {
							headers: {
								'Content-Type': 'application/json'
								// Authorization: `Bearer ${props.currentUser.token}`
							},
							project: {
								...inputs,
								markdown: markdownText,
								image_id: resp.data.public_id,
								user_id: props.currentUser.id
							},
							tags: selectedTags
						})
						.then((data) => {
							setRedirect(true)
						})
				})
		} else {
			axios
				.post(window._API_URL_ + 'projects', {
					headers: {
						'Content-Type': 'application/json'
						// Authorization: `Bearer ${props.currentUser.token}`
					},
					project: {
						...inputs,
						markdown: markdownText,
						image_id: '',
						user_id: props.currentUser.id
					},
					tags: selectedTags
				})
				.then((data) => {
					setRedirect(true)
				})
		}
	}

	const renderFormField = (name, type = 'text') => {
		return (
			<Form.Field>
				{type === 'textarea' ? (
					<Form.TextArea
						maxLength={500}
						label={namify(name)}
						name={name}
						value={inputs[name]}
						onChange={handleInputChange}
					/>
				) : (
					<Form.Input label={namify(name)} name={name} value={inputs[name]} onChange={handleInputChange} />
				)}
			</Form.Field>
		)
	}

	const renderForm = () => {
		return (
			<React.Fragment>
				<div className='project-form'>
					<Form.Field className='project-form-image'>
						<label className='label'>Cover</label>
						<ImageUploader
							singleImage
							withIcon
							buttonText='Upload Image'
							onChange={handleUploadImage}
							files={[ imageUrl ]}
							imgExtension={[ '.jpg', '.gif', '.png' ]}
							maxFileSize={5242880}
						/>
						{imageUrl && (
							<div className='image-preview-container'>
								<div className='image-preview' style={{ background: `url(${imageUrl})` }}>
									{/*<Button icon='delete' color='red' />*/}
								</div>
							</div>
						)}
					</Form.Field>
					<div className='project-form-details'>
						{renderFormField('display_name')}
						{renderFormField('repo_url')}
						{renderFormField('project_url')}
						{renderFormField('description', 'textarea')}
						<Form.Field>
							<label htmlFor='markdown'>Markdown</label>
							<ReactMde
								value={markdownText}
								onChange={handleMarkdownChange}
								onTabChange={() => setMdeIsPreview(!mdeIsPreview)}
								selectedTab={mdeIsPreview ? 'preview' : 'write'}
								generateMarkdownPreview={(md) => Promise.resolve(marked(md))}
							/>
						</Form.Field>
					</div>
				</div>
				<Form.Field className='tags'>
					<label className='label'>Tags</label>
					<Dropdown
						fluid
						multiple
						search
						selection
						onChange={handleTagsChange}
						value={selectedTags}
						onBlur={() => setDropdownTags(getTagOptions(selectedTags))}
						onFocus={() => setDropdownTags(props.tagOptions)}
						options={dropdownTags}
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
			{selectedRepo && (
				<Form className='animated fadeInUp'>
					{renderForm()}
					<div className='project-form-buttons'>
						{redirect && <Redirect to='/' />}
						<Button primary onClick={handleSubmit} type='submit'>
							Create Project
						</Button>
						<Button secondary>Cancel</Button>
					</div>
				</Form>
			)}
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