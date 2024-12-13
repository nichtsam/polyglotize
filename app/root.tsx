import { type MetaFunction, type LinksFunction } from '@remix-run/node'
import { Links, Meta, Outlet, Scripts } from '@remix-run/react'
import stylesheet from '#app/styles/app.css?url'
import { SiteHeader } from './components/site-header'

export const meta: MetaFunction = () => [
	{ title: 'wtf.' },
	{
		name: 'description',
		content: `Translation app for language learning purpose`,
	},
]

export const links: LinksFunction = () => [
	{ rel: 'stylesheet', href: stylesheet },
]

export default function App() {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				<SiteHeader />
				<main className="p-4">
					<Outlet />
				</main>

				<Scripts />
			</body>
		</html>
	)
}
