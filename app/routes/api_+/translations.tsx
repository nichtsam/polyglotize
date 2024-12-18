import { parseWithZod } from '@conform-to/zod'
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { z } from 'zod'
import { translate } from '#app/utils/translate.server.ts'
import { Language } from '#app/utils/translate.ts'

export const schema = z.object({
	expression: z
		.string({
			required_error: 'Expression is required for an polyglotization!',
		})
		.max(120, 'Expression is limited to 120 characters.'),
	languages: z
		.array(z.nativeEnum(Language))
		.min(1, 'At least one of the target languages must be selected!'),
})

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const searchParams = new URL(request.url).searchParams
	const submission = parseWithZod(searchParams, {
		schema,
	})

	if (submission.status !== 'success') {
		return json(
			{ result: submission.reply(), data: null },
			{ status: submission.status === 'error' ? 400 : 200 },
		)
	}

	const { expression, languages } = submission.value
	const polyglotization = await translate(expression, languages)

	if (!polyglotization) {
		throw new Error('TODO')
	}

	return json({
		result: submission.reply(),
		data: {
			expression,
			polyglotization,
		},
	})
}
