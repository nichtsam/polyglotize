import * as React from 'react'

import { cn } from '#app/utils/ui.ts'

const Textarea = React.forwardRef<
	HTMLTextAreaElement,
	React.ComponentProps<'textarea'> & { autoResize?: boolean }
>(({ className, autoResize, onInput, ...props }, ref) => {
	return (
		<textarea
			onInput={
				autoResize
					? (e) => {
							const target = e.target as HTMLTextAreaElement
							target.style.height = 'auto'
							target.style.height = target.scrollHeight + 2 + 'px'
						}
					: onInput
			}
			className={cn(
				'flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
				className,
			)}
			ref={ref}
			{...props}
		/>
	)
})
Textarea.displayName = 'Textarea'

export { Textarea }
