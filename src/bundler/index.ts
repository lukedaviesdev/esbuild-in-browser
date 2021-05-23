import * as esbuild from 'esbuild-wasm'
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin'
import { fetchPlugin } from './plugins/fetch-plugin'

let service: esbuild.Service

export const bundler = async (rawCode: string) => {
	if (!service) {
		service = await esbuild.startService({
			worker: true,
			wasmURL: 'https://www.unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
		})
	}

	const result = await service.build({
		entryPoints: ['index.js'],
		bundle: true,
		write: false,
		plugins: [unpkgPathPlugin(rawCode), fetchPlugin(rawCode)],
		define: {
			'process.env.NODE_ENV': '"production"',
			global: 'window',
		},
	})

	return result.outputFiles[0].text
}
