import React, { useState } from 'react'
import ImgUploader from 'react-images-upload'

const ImageUploader = () => {
	const [ image, setImage ] = useState(null)

	const handleImageDrop = (files, URLs) => {
		console.log(files, URLs)
	}

	return (
		<ImgUploader
			withIcon
			buttonText='Upload image'
			onChange={handleImageDrop}
			imgExtension={[ '.jpg', '.gif', '.png' ]}
			maxFileSize={5242880}
		/>
	)
}

export default ImageUploader
