import { Circle } from 'lucide-react'
import { useId } from 'react'
import { cn } from '#app/utils/ui.ts'

export namespace Radio {
	export type Props = Omit<
		React.DetailedHTMLProps<
			React.InputHTMLAttributes<HTMLInputElement>,
			HTMLInputElement
		>,
		'type'
	>
}

export function Radio({ name, id, className, ...props }: Radio.Props) {
	const fallbackId = useId()
	if (!id) {
		id = name ? `${name}-${fallbackId}` : fallbackId
	}

	return (
		<label
			htmlFor={props.disabled ? undefined : id}
			className={cn(
				'inline-block aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow',
				'has-[:focus-visible]:ring-1 has-[:focus-visible]:ring-ring',
				'has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50',
				className,
			)}
		>
			<input
				id={id}
				name={name}
				type="radio"
				className="peer pointer-events-none absolute appearance-none focus-visible:outline-none disabled:cursor-not-allowed"
				{...props}
			/>

			<span className="flex items-center justify-center opacity-0 peer-checked:opacity-100">
				<Circle className="h-3.5 w-3.5 fill-primary" />
			</span>
		</label>
	)
}

Radio.displayName = 'Radio'
