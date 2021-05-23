import { Box, Flex } from '@chakra-ui/react'
import React, { useEffect, useRef } from 'react'
import { htmlTemplate } from './html-template'
import './preview.css'

interface OwnProps {
	code: string
}

export const Preview: React.FC<OwnProps> = ({ code }) => {
	const iframe = useRef<any>()

	useEffect(() => {
		iframe.current.srcdoc = htmlTemplate
		iframe.current.contentWindow.postMessage(code, '*')
	}, [code])

	return (
		<div className="preview-wrapper">
			<iframe
				ref={iframe}
				title="users-html"
				srcDoc={htmlTemplate}
				sandbox="allow-scripts"
			/>
		</div>
	)
}
