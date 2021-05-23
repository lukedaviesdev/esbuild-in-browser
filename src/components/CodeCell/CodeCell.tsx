import { useState, useEffect } from 'react'

import { Flex } from '@chakra-ui/react'
import { CodeEditor } from '../codeEditor'
import { Preview } from '../Preview'
import { bundler } from '../../bundler'
import { Resizable } from '../Resizable'

export const CodeCell = () => {
	const [input, setInput] = useState('')
	const [codeResult, setCodeResult] = useState('')

	useEffect(() => {
		const timer = setTimeout(async () => {
			const output = await bundler(input)
			setCodeResult(output)
		}, 1000)

		return () => {
			clearTimeout(timer)
		}
	}, [input])

	return (
		<Resizable direction="vertical">
			<Flex height="100%">
				<Resizable direction="horizontal">
					<CodeEditor
						initialValue="import React from 'react'"
						onChange={(value) => setInput(value)}
					/>
				</Resizable>

				<Preview code={codeResult} />
			</Flex>
		</Resizable>
	)
}
