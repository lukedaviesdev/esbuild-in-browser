import { useEffect, useState } from 'react'
import { ResizableBox, ResizableBoxProps } from 'react-resizable'
import debounce from 'lodash.debounce'
import './resizable.css'

interface OwnProps {
	direction: 'horizontal' | 'vertical'
}
export const Resizable: React.FC<OwnProps> = ({ direction, children }) => {
	const [innerWidth, setInnerWidth] = useState(window.innerWidth)
	const [innerHeight, setInnerHeight] = useState(window.innerHeight)
	const [width, setwidth] = useState(window.innerWidth * 0.75)

	useEffect(() => {
		const listener = () => {
			setInnerHeight(window.innerHeight)
			setInnerWidth(window.innerWidth)
			if (window.innerWidth * 0.75 < width) {
				setwidth(window.innerWidth * 0.75)
			}
		}
		window.addEventListener('resize', debounce(listener, 150))

		return () => {
			window.removeEventListener('resize', debounce(listener, 150))
		}
	}, [width])

	let resizableProps: ResizableBoxProps

	if (direction === 'horizontal') {
		resizableProps = {
			className: 'resize-horizontal',
			minConstraints: [innerWidth * 0.2, Infinity],
			maxConstraints: [innerWidth * 0.75, Infinity],
			width,
			height: Infinity,
			resizeHandles: ['e'],
			axis: 'x',
			onResizeStop: (e, data) => {
				setwidth(data.size.width)
			},
		}
	} else {
		resizableProps = {
			minConstraints: [Infinity, 100],
			maxConstraints: [Infinity, innerHeight * 0.7],
			width: Infinity,
			height: 500,
			resizeHandles: ['s'],
			axis: 'y',
		}
	}

	return <ResizableBox {...resizableProps}>{children}</ResizableBox>
}
