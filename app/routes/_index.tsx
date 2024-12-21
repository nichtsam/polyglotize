import { Link } from '@remix-run/react'

export default function Page() {
	return (
		<article className="prose p-4 dark:prose-invert">
			<h2>Try it out</h2>
			<nav>
				<ul>
					{mainNav.map(({ href, title }) => (
						<li key={href}>
							<Link to={href} prefetch="intent">
								{title}
							</Link>
						</li>
					))}
				</ul>
			</nav>
		</article>
	)
}
