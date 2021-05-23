import { Box, ChakraProvider } from '@chakra-ui/react'
import { CodeCell } from './components/CodeCell'

export const App = () => {
	return (
		<ChakraProvider>
			<Box bg="teal.900" height="100vh">
				<CodeCell />
			</Box>
		</ChakraProvider>
	)
}
