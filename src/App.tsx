import { useState, useEffect, useRef } from 'react'
import * as esbuild from 'esbuild-wasm'

export const App = () => {
	const serviceRef = useRef<any>()
	const [input, setInput] = useState('')
	const [code, setCode] = useState('')

	const startService = async () => {
		serviceRef.current = await esbuild.startService({
			worker: true,
			wasmURL: '/esbuild.wasm',
		})
	}

	useEffect(() => {
		startService()
	}, [])

	const handleChange = (e: any) => {
		setInput(e.target.value)
	}

	const handleClick = async () => {
		if (!serviceRef.current) {
			return
		}
		const result = await serviceRef.current.transform(input, {
			loader: 'jsx',
			target: 'es2015',
		})

		if (result.code) {
			setCode(result.code)
		}

		// use esbuild to transpile the string and set to state:code
	}

	return (
		<div>
			<textarea onChange={(e) => handleChange(e)} value={input}></textarea>
			<div>
				<button onClick={handleClick}>Submit</button>
			</div>
			<pre>{code}</pre>
		</div>
	)
}
