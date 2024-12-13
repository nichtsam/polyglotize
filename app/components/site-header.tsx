import { Link, useLocation } from '@remix-run/react'
import { Menu } from 'lucide-react'
import { useEffect, useState } from 'react'
import { mainNav } from '#app/config/config.ts'
import { Button } from './ui/button.tsx'
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from './ui/drawer.tsx'
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from './ui/navigation-menu'

export function SiteHeader() {
	return (
		<header className="flex items-center gap-x-4 px-8 py-4 shadow">
			<Logo />

			<MainNav />
			{/* Spacing adjustment */}
			<div className="flex-grow" />
			<MobileNav />
		</header>
	)
}

function MainNav() {
	return (
		<NavigationMenu className="hidden md:flex">
			<NavigationMenuList>
				{mainNav.map(({ title, href }) => (
					<NavigationMenuItem key={href}>
						<NavigationMenuLink asChild>
							<Link
								prefetch="intent"
								to={href}
								className={navigationMenuTriggerStyle()}
							>
								{title}
							</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>
				))}
			</NavigationMenuList>
		</NavigationMenu>
	)
}

let firstRender = true
function MobileNav() {
	const [open, setOpen] = useState(false)

	const location = useLocation()

	const onOpenChange = (open: boolean) => {
		setOpen(open)
	}

	const closeDrawer = () => {
		setOpen(false)
	}

	useEffect(() => {
		if (firstRender) {
			return
		}

		closeDrawer()
	}, [location.key, location.pathname])

	useEffect(() => {
		firstRender = false
	}, [])

	return (
		<Drawer open={open} onOpenChange={onOpenChange}>
			<DrawerTrigger asChild>
				<Button
					variant="ghost"
					className="-ml-2 mr-2 h-8 w-8 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
				>
					<Menu />
					<span className="sr-only">Toggle Menu</span>
				</Button>
			</DrawerTrigger>
			<DrawerContent className="max-h-[60svh]">
				<DrawerHeader>
					<DrawerTitle>Navigation</DrawerTitle>
				</DrawerHeader>
				<div className="overflow-auto px-4 pb-6 pt-2">
					<nav className="text-center sm:text-left">
						<ul className="flex flex-col gap-y-3">
							{mainNav.map(({ title, href }) => (
								<li key={href}>
									<Link prefetch="intent" to={href}>
										{title}
									</Link>
								</li>
							))}
						</ul>
					</nav>
				</div>
			</DrawerContent>
		</Drawer>
	)
}

function Logo() {
	return (
		<Link className="hover:underline" to="/">
			<span className="text-3xl font-bold">wtf.</span>
		</Link>
	)
}
