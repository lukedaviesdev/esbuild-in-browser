import React, { useState } from 'react'

import { Box, Button, Flex, Grid, GridItem } from '@chakra-ui/react'
import { CodeEditor } from '../codeEditor'
import { Preview } from '../Preview'
import { bundler } from '../../bundler'
import { Resizable } from '../Resizable'

export const CodeCell = () => {
	const [input, setInput] = useState('')
	const [codeResult, setCodeResult] = useState('')

	const handleClick = async () => {
		const output = await bundler(input)
		setCodeResult(output)
	}

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
