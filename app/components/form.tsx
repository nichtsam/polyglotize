import { cn } from '#app/utils/ui.ts'
import { Badge } from './ui/badge.tsx'

export type Errors = (string | null | undefined)[] | null | undefined
export interface ErrorListProps {
	className?: string
	errors?: Errors
	errorId?: string
}
export const ErrorList = ({ errorId, errors, className }: ErrorListProps) => {
	const errorsToRender = errors?.filter(Boolean)
	if (!errorsToRender?.length) return null

	return (
		<ul
			id={errorId}
			className={cn('text-de my-2 flex flex-col gap-2', className)}
		>
			{errors!.map((error) => (
				<li key={error}>
					<Badge variant="destructive">{error}</Badge>
				</li>
			))}
		</ul>
	)
}
