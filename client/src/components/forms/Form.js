import React, { Component } from 'react'
import '../styles/form.css'

class Form extends Component {
	state = {}

	handleInputChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		})
	}

	handleSubmit(e) {
		e.preventDefault()
		this.props.handleSubmit(this.state)
	}

	render() {
		const { elements, children } = this.props

		return (
			<form onSubmit={this.handleSubmit} className='form'>
				{elements.map(({ name, type = 'text', placeholder }) => {
					return <input name={name} type={type} placeholder={placeholder} onChange={this.handleInputChange} />
				})}
				{children}
			</form>
		)
	}
}

export default Form
