import { useState, useEffect, useRef } from 'react'
import * as esbuild from 'esbuild-wasm'
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin'
import { fetchPlugin } from './plugins/fetch-plugin'

export const App = () => {
	const serviceRef = useRef<any>()
	const iframe = useRef<any>()
	const [input, setInput] = useState('')

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
		iframe.current.srcdoc = html
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

		iframe.current.contentWindow.postMessage(result.outputFiles[0].text, '*')
	}
	const html = `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8"/>
			<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
			<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
			<title>Running your code</title>

		</head>
		<body>
			<div id="root"></div>
			<script>
				window.addEventListener('message', (event)=>{
					try{
						eval(event.data)
					}catch(e){
						const root = document.querySelector('#root');
						const errorMessage = document.createElement('div');
						errorMessage.style.color = 'red';
						errorMessage.innerHTML = '<h4>Runtime Error</h4></p>'+e+'</p>';
						root.append(errorMessage)
						console.error(e)
					}
				}, false)
			</script>
		</body>
		</html>
	`
	return (
		<div>
			<textarea onChange={(e) => handleChange(e)} value={input}></textarea>
			<div>
				<button onClick={handleClick}>Submit</button>
			</div>
			<iframe
				ref={iframe}
				title="users-html"
				srcDoc={html}
				sandbox="allow-scripts"
			/>
		</div>
	)
}
