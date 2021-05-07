import * as esbuild from 'esbuild-wasm'
import axios from 'axios'
import localForage from 'localforage'

const fileCache = localForage.createInstance({
	name: 'filecache',
})

export const unpkgPathPlugin = (inputCode: string) => {
	return {
		name: 'unpkg-path-plugin',
		setup(build: esbuild.PluginBuild) {
			build.onResolve({ filter: /.*/ }, async (args: any) => {
				console.log('onResolve', args)

				if (args.path === 'index.js') {
					return { path: args.path, namespace: 'a' }
				}

				if (args.path.includes('./') || args.path.includes('../')) {
					const url = new URL(args.path, `https://unpkg.com${args.resolveDir}/`)

					return {
						path: url.href,
						namespace: 'a',
					}
				}

				return {
					namespace: 'a',
					path: `https://unpkg.com/${args.path}`,
				}
			})

			build.onLoad({ filter: /.*/ }, async (args: any) => {
				console.log('onLoad', args)
				if (args.path === 'index.js') {
					return {
						loader: 'jsx',
						contents: inputCode,
					}
				}

				const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
					args.path,
				)

				if (cachedResult) {
					return cachedResult
				}

				const { data, request } = await axios.get(args.path)

				const result: esbuild.OnLoadResult = {
					loader: 'jsx',
					contents: data,
					resolveDir: new URL('./', request.responseURL).pathname,
				}

				await fileCache.setItem(args.path, result)

				return result
			})
		},
	}
}
