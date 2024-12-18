import { SchemaType } from '@google/generative-ai'
import { z } from 'zod'
import { genAI } from '#app/utils/ai.server.ts'
import { Language } from './translate.ts'

const polyglotizationSchema = z.array(
	z.object({
		language: z.nativeEnum(Language),
		expressions: z.array(z.string()),
	}),
)

export async function translate(string: string, targets: Language[]) {
	const prompt =
		`Translate the following string into the specified languages: ${targets}. ` +
		'Generate exactly 1 translation for each language specified. ' +
		`String: "${string}"`

	const schema = {
		description: 'An array of translation groups for the provided string.',
		type: SchemaType.ARRAY,
		items: {
			type: SchemaType.OBJECT,
			properties: {
				language: {
					nullable: false,
					type: SchemaType.STRING,
					description: 'The name or code of the target language',
				},
				expressions: {
					nullable: false,
					type: SchemaType.ARRAY,
					description:
						'An array of possible translations into the target language.',
					items: {
						type: SchemaType.STRING,
						description: 'The translated string in the target language.',
					},
				},
			},
			required: ['language', 'expressions'],
		},
	}

	const model = genAI.getGenerativeModel({
		model: 'gemini-1.5-flash-8b',
		generationConfig: {
			responseMimeType: 'application/json',
			responseSchema: schema,
		},
	})

	const result = await model.generateContent(prompt)
	const parsedJson = JSON.parse(result.response.text())
	const parsed = polyglotizationSchema.safeParse(parsedJson)

	if (!parsed.success) {
		console.error(parsed.error)
		return null
	}

	return parsed.data
}
