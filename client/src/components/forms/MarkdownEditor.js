import React, { useState } from 'react'
import ReactMde from 'react-mde'
import { getHtml } from '../helpers/formHelper'
import marked from 'marked'
import 'react-mde/lib/styles/css/react-mde-all.css'

const MarkdownEditor = () => {
	return (
		<ReactMde
			value={text}
			onChange={handleTextChange}
			onTabChange={() => setMdeIsPreview(!mdeIsPreview)}
			selectedTab={mdeIsPreview ? 'preview' : 'write'}
			generateMarkdownPreview={(md) => Promise.resolve(marked(md))}
		/>
	)
}

export default MarkdownEditor
