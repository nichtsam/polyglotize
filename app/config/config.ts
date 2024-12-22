import { type NavLink } from '#app/model/nav.ts'

export const mainNav: NavLink[] = [
	{
		title: 'Translate',
		href: '/translate',
	},
	{
		title: 'elaborate',
		href: '/elaborate',
		disabled: true,
	},
].filter(({ disabled }) => !disabled)
