import 'dotenv/config'
import { createRequestHandler } from '@remix-run/express'
import chalk from 'chalk'
import closeWithGrace from 'close-with-grace'
import express from 'express'
import getPort, { portNumbers } from 'get-port'
import morgan from 'morgan'
import { printUrls } from './server-utils.js'

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

const desiredPort = Number(process.env.PORT || 3000)
const portToUse = await getPort({
	port: portNumbers(desiredPort, desiredPort + 100),
})

const server = app.listen(portToUse, () => {
	const addr = server.address()
	const portUsed = typeof addr === 'object' ? addr.port : addr

	if (portUsed !== desiredPort) {
		console.warn(
			chalk.yellow(
				`⚠️  Port ${desiredPort} is not available, using ${portUsed} instead.`,
			),
		)
	}

	console.log(`🚀 App started`)

	printUrls(portUsed)

	console.log(chalk.bold('Press Ctrl+C to stop'))
})

closeWithGrace(async ({ err }) => {
	if (err) {
		console.error(chalk.red(err))
		console.error(chalk.red(err.stack))
		process.exit(1)
	}

	await new Promise((resolve, reject) => {
		server.close((e) => (e ? reject(e) : resolve()))
	})
})
