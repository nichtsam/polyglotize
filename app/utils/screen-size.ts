import { useMatches } from '@remix-run/react'
import { z } from 'zod'

const screenSizeSchema = z.boolean()
const screenSizeHandleSchema = z.object({ screenSize: screenSizeSchema })

export type ScreenSizeHandle = z.infer<typeof screenSizeHandleSchema>

export const useScreenSize = () => {
	const matches = useMatches()
	const screenSize = matches.some(({ handle }) => {
		const result = screenSizeHandleSchema.safeParse(handle)
		return result.success && result.data.screenSize
	})

	return screenSize
}
