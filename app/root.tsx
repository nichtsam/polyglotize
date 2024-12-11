import { type MetaFunction, type LinksFunction } from '@remix-run/node'
import { Link, Links, Meta, Outlet, Scripts } from '@remix-run/react'
import stylesheet from '#app/styles/app.css?url'

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
				<header className="flex items-center gap-x-4 px-8 py-4">
					<Logo />

					<nav className="flex gap-x-4">
						<Link prefetch="intent" to="/translation">
							Translation
						</Link>
						<Link prefetch="intent" to="/elaboration">
							Elaboration
						</Link>
					</nav>
				</header>
				<main className="p-4">
					<Outlet />
				</main>

				<Scripts />
			</body>
		</html>
	)
}

function Logo() {
	return <Link to="/">wtf.</Link>
}
