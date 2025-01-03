import { type MetaFunction, type LinksFunction } from '@remix-run/node'
import { Links, Meta, Outlet, Scripts } from '@remix-run/react'
import stylesheet from '#app/styles/app.css?url'
import { SiteHeader } from './components/site-header'
import { useScreenSize } from './utils/screen-size.ts'
import { cn } from './utils/ui.ts'

export const meta: MetaFunction = () => [
	{ title: 'Polyglotize' },
	{
		name: 'description',
		content: `Learn languages by expressing and understanding the logic behind.`,
	},
]

export const links: LinksFunction = () => [
	{ rel: 'stylesheet', href: stylesheet },
]

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				{children}

				<Scripts />
			</body>
		</html>
	)
}

export default function App() {
	const screenSize = useScreenSize()

	return (
		<div
			className={cn('flex min-h-svh flex-col', screenSize && 'h-svh max-h-svh')}
		>
			<SiteHeader />
			<div className={cn('flex flex-grow flex-col', screenSize && 'min-h-0')}>
				<Outlet />
			</div>
		</div>
	)
}
