import { Check } from 'lucide-react'
import { useId } from 'react'
import { cn } from '#app/utils/ui.ts'

export namespace Checkbox {
	export type Props = Omit<
		React.DetailedHTMLProps<
			React.InputHTMLAttributes<HTMLInputElement>,
			HTMLInputElement
		>,
		'type'
	>
}

export function Checkbox({ name, id, className, ...props }: Checkbox.Props) {
	const fallbackId = useId()
	if (!id) {
		id = name ? `${name}-${fallbackId}` : fallbackId
	}

	return (
		<label
			htmlFor={props.disabled ? undefined : id}
			className={cn(
				'inline-block h-4 w-4 shrink-0 cursor-pointer rounded-sm border border-primary shadow',
				'has-[:checked]:bg-primary',
				'has-[:focus-visible]:ring-1 has-[:focus-visible]:ring-ring',
				'has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50',
				className,
			)}
		>
			<input
				id={id}
				name={name}
				className="peer pointer-events-none absolute appearance-none focus-visible:outline-none disabled:cursor-not-allowed"
				type="checkbox"
				{...props}
			/>
			<span className="pointer-events-none relative flex items-center opacity-0 peer-checked:opacity-100">
				<Check className="h-4 w-4 text-primary-foreground" />
			</span>
		</label>
	)
}

Checkbox.displayName = 'CheckBox'
