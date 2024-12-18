import 'dotenv/config'
import { createRequestHandler } from '@remix-run/express'
import express from 'express'
import morgan from 'morgan'

const viteDevServer =
	process.env.NODE_ENV === 'production'
		? null
		: await import('vite').then((vite) =>
				vite.createServer({
					server: { middlewareMode: true },
				}),
			)

const app = express()
app.use(
	morgan('tiny', {
		skip:
			process.env.NODE_ENV === 'development'
				? (req, res) => {
						if (
							req.url.startsWith('/node_modules') ||
							req.url.startsWith('/app') ||
							req.url.startsWith('/@') ||
							req.url.startsWith('/__')
						) {
							if (res.statusCode === 200 || res.statusCode === 304) {
								return true
							}
						}
					}
				: undefined,
	}),
)
app.use(
	viteDevServer ? viteDevServer.middlewares : express.static('build/client'),
)

const build = viteDevServer
	? () => viteDevServer.ssrLoadModule('virtual:remix/server-build')
	: await import('./build/server/index.js')

app.all('*', createRequestHandler({ build }))

app.listen(3000, () => {
	console.log('App listening on http://localhost:3000')
})
