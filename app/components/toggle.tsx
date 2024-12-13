import { cva, type VariantProps } from 'class-variance-authority'
import { useId } from 'react'
import { cn } from '#app/utils/ui.ts'

const toggleVariants = cva(
	'inline-flex gap-2 cursor-pointer items-center justify-center rounded-md px-8 text-sm font-medium transition-colors ' +
		'hover:bg-muted hover:text-muted-foreground ' +
		'has-[:checked]:bg-accent has-[:checked]:text-accent-foreground ' +
		'has-[:focus-visible]:outline-none has-[:focus-visible]:ring-1 has-[:focus-visible]:ring-ring ' +
		'has-[:disabled]:pointer-events-none has-[:disabled]:cursor-default has-[:disabled]:opacity-50',
	{
		variants: {
			variant: {
				default: 'bg-transparent',
				outline:
					'border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground',
			},
			size: {
				default: 'h-9 px-2 min-w-9',
				sm: 'h-8 px-1.5 min-w-8',
				lg: 'h-10 px-2.5 min-w-10',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
)

export namespace Toggle {
	export type Props = Omit<
		React.DetailedHTMLProps<
			React.InputHTMLAttributes<HTMLInputElement>,
			HTMLInputElement
		>,
		'type'
	> &
		VariantProps<typeof toggleVariants>
}

export function Toggle({
	children,
	name,
	id,
	className,
	variant,
	size,
	...props
}: Toggle.Props) {
	const fallbackId = useId()
	if (!id) {
		id = name ? `${name}-${fallbackId}` : fallbackId
	}

	return (
		<label
			htmlFor={props.disabled ? undefined : id}
			className={cn(toggleVariants({ variant, size, className }))}
		>
			<input
				id={id}
				name={name}
				type="checkbox"
				className="pointer-events-none absolute appearance-none focus-visible:outline-none disabled:cursor-not-allowed"
				{...props}
			/>
			{children}
		</label>
	)
}

Toggle.displayName = 'Toggle'
