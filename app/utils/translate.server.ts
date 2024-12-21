import { Translator, type TargetLanguageCode } from 'deepl-node'
import { z } from 'zod'
import { targetLangs } from './translate'

const translator = new Translator(process.env.DEEPL_KEY!)

const polyglotizationSchema = z.array(
	z.object({
		language: z.enum(targetLangs),
		expressions: z.array(z.string()),
	}),
)

export async function translate(string: string, targets: TargetLanguageCode[]) {
	const promises = targets.map(async (target) => {
		const translation = await translator.translateText(string, null, target)

		return {
			language: target,
			expressions: [translation.text],
		}
	})

	const result = await Promise.all(promises)
	const parsed = polyglotizationSchema.safeParse(result)

	if (!parsed.success) {
		console.error(parsed.error)
		return null
	}

	return parsed.data
}
