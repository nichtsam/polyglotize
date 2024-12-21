import { parseWithZod } from '@conform-to/zod'
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { z } from 'zod'
import { targetLangs } from '#app/utils/translation.ts'
import { Translator } from '#app/utils/translator.server.ts'

export const schema = z.object({
	expression: z
		.string({
			required_error: 'Expression is required for an polyglotization!',
		})
		.max(120, 'Expression is limited to 120 characters.'),
	languages: z
		.array(z.enum(targetLangs))
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
	const translator = new Translator(process.env.DEEPL_KEY!)
	const polyglotization = await translator.translate(expression, languages)

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
