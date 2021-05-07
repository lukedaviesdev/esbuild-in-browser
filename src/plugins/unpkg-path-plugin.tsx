import * as esbuild from 'esbuild-wasm'
import axios from 'axios'

export const unpkgPathPlugin = () => {
	return {
		name: 'unpkg-path-plugin',
		setup(build: esbuild.PluginBuild) {
			// finding the file
			build.onResolve({ filter: /.*/ }, async (args: any) => {
				console.log('onResolve', args)

				// esbuild epects you to return an object,
				// then uses this object in build.onLoad
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

			// loading the file, using the filepath
			// returned by build.onResolve()
			build.onLoad({ filter: /.*/ }, async (args: any) => {
				console.log('onLoad', args)
				// hyjacks the loading of the file and returns an
				// object, in the shape esbuild is expecting, with
				// the custom contents
				if (args.path === 'index.js') {
					return {
						loader: 'jsx',
						contents: `import react from 'react@16.0.0';
							console.log(react);`,
					}
				}

				const { data, request } = await axios.get(args.path)

				return {
					loader: 'jsx',
					contents: data,
					resolveDir: new URL('./', request.responseURL).pathname,
				}
			})
		},
	}
}
