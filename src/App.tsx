import { useState, useEffect, useRef } from 'react'
import * as esbuild from 'esbuild-wasm'
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin'
import { fetchPlugin } from './plugins/fetch-plugin'

export const App = () => {
	const serviceRef = useRef<any>()
	const [input, setInput] = useState('')
	const [code, setCode] = useState('')

	const startService = async () => {
		serviceRef.current = await esbuild.startService({
			worker: true,
			wasmURL: 'https://www.unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
		})
	}

	useEffect(() => {
		startService()
	}, [])

	const handleChange = (e: any) => {
		setInput(e.target.value)
	}

	const handleClick = async () => {
		const service = serviceRef.current

		if (!service) {
			return
		}
		const result = await service.build({
			entryPoints: ['index.js'],
			bundle: true,
			write: false,
			plugins: [unpkgPathPlugin(input), fetchPlugin(input)],
			define: {
				'process.env.NODE_ENV': '"production"',
				global: 'window',
			},
		})

		if (result.outputFiles[0].text) {
			setCode(result.outputFiles[0].text)
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
