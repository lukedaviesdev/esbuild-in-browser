import { Box } from '@chakra-ui/layout'
import styled from 'styled-components'

export const StyledCodeEditorWrap = styled.div`
	position: relative;
`
export const StyledButtonWrap = styled(Box)`
	position: absolute;
	right: 0;
	z-index: 1;

	.button {
		width: 4rem;
		height: 30px;
	}
`
