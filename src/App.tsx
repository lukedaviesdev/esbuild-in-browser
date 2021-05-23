import React, { useState } from 'react'

import { Box, ChakraProvider } from '@chakra-ui/react'
import { CodeCell } from './components/CodeCell'
import { bundler } from './bundler'

export const App = () => {
	return (
		<ChakraProvider>
			<Box bg="blue.800" height="100vh">
				<CodeCell />
			</Box>
		</ChakraProvider>
	)
}
