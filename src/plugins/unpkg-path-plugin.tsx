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
				if (args.path === 'tiny-test-pkg') {
					return {
						path: `https://www.unpkg.com/${args.path}@1.0.0/index.js`,
						namespace: 'a',
					}
				} else {
					return { path: args.path, namespace: 'a' }
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
						contents: `import message from 'tiny-test-pkg';
							console.log(message);`,
					}
				} else {
					const { data } = await axios.get(args.path)
					return {
						loader: 'jsx',
						contents: data,
					}
				}
			})
		},
	}
}
