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
		const timer = setTimeout(() => {
			iframe.current.contentWindow.postMessage(code, '*')
		}, 30)

		return () => {
			clearTimeout(timer)
		}
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
