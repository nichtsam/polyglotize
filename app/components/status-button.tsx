import { CheckCircle, CircleX, LoaderCircle } from 'lucide-react'
import { forwardRef } from 'react'
import { cn } from '#app/utils/ui.ts'
import { type ButtonProps, Button } from './ui/button.tsx'

export interface StatusButtonProps extends ButtonProps {
	status: 'success' | 'pending' | 'error' | 'idle'
}
export const StatusButton = forwardRef<HTMLButtonElement, StatusButtonProps>(
	({ status, className, children, ...props }, ref) => {
		const statusIcon = {
			success: <CheckCircle />,
			pending: <LoaderCircle className="animate-spin" />,
			error: (
				<CircleX className="rounded-full bg-destructive text-destructive-foreground" />
			),
			idle: null,
		}[status]

		return (
			<Button
				disabled={status === 'pending'}
				ref={ref}
				className={cn('flex justify-center gap-x-4', className)}
				{...props}
			>
				{children}
				{statusIcon}
			</Button>
		)
	},
)

StatusButton.displayName = 'StatusButton'
