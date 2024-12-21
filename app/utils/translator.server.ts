import {
	Translator as DeeplTranslator,
	type TargetLanguageCode,
} from 'deepl-node'
import { z } from 'zod'
import { targetLangs } from './translation.ts'

const polyglotizationSchema = z.array(
	z.object({
		language: z.enum(targetLangs),
		expressions: z.array(z.string()),
	}),
)

export class Translator {
	translator: DeeplTranslator

	constructor(authKey: string) {
		this.translator = new DeeplTranslator(authKey)
	}

	public async translate(string: string, targets: TargetLanguageCode[]) {
		const promises = targets.map(async (target) => {
			const translation = await this.translator.translateText(
				string,
				null,
				target,
			)

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
}
