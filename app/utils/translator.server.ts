import { createCookieSessionStorage } from '@remix-run/node'
import { Translator as DeeplTranslator } from 'deepl-node'
import { createTypedSessionStorage } from 'remix-utils/typed-session'
import { z } from 'zod'
import { getCookieHeader } from './request.server'
import { SourceLangCode, TargetLangCode } from './translation.ts'

export const settingsSessionStorage = createTypedSessionStorage({
	sessionStorage: createCookieSessionStorage({
		cookie: {
			name: '_translation',
			sameSite: 'lax',
			path: '/',
			httpOnly: true,
			secrets: process.env.SESSION_SECRET!.split(','),
			secure: process.env.NODE_ENV === 'production',
		},
	}),
	schema: z.object({
		sourceLanguage: SourceLangCode.default('detect'),
		targetLanguages: z.array(TargetLangCode).min(1).optional(),
	}),
})

export const getSettingsSession = async (request: Request) => {
	const cookie = getCookieHeader(request)
	return await settingsSessionStorage.getSession(cookie)
}

const polyglotizationSchema = z.array(
	z.object({
		language: TargetLangCode,
		expression: z.string(),
	}),
)

export class Translator {
	translator: DeeplTranslator

	constructor(authKey: string) {
		this.translator = new DeeplTranslator(authKey)
	}

	public async translate(
		string: string,
		sourceLang: SourceLangCode | null | undefined,
		targetLangs: TargetLangCode[],
	) {
		if (!sourceLang || sourceLang === 'detect') {
			sourceLang = null
		}

		const promises = targetLangs.map(async (targetLang) => {
			const translation = await this.translator.translateText(
				string,
				sourceLang,
				targetLang,
			)

			return {
				language: targetLang,
				expression: translation.text,
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
