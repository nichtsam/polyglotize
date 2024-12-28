import {
	type SourceLanguageCode as DeeplSourceLangCode,
	type TargetLanguageCode as DeeplTargetLangCode,
} from 'deepl-node'
import { z } from 'zod'

// prettier-ignore
const commonLangCodes = ['ar', 'bg', 'cs', 'da', 'de', 'el', 'es', 'et', 'fi', 'fr', 'hu', 'id', 'it', 'ja', 'ko', 'lt', 'lv', 'nb', 'nl', 'pl', 'ro', 'ru', 'sk', 'sl', 'sv', 'tr', 'uk', 'zh'] as const
export const SourceLangCode = z.enum([
	...commonLangCodes,
	'en',
	'pt',
	'detect',
] as const satisfies (DeeplSourceLangCode | 'detect')[])
export const TargetLangCode = z.enum([
	...commonLangCodes,
	'en-GB',
	'en-US',
	'pt-BR',
	'pt-PT',
] as const satisfies DeeplTargetLangCode[])

export type SourceLangCode = z.infer<typeof SourceLangCode>
export type TargetLangCode = z.infer<typeof TargetLangCode>
type LanguageConfig = { label: string }

export const sourceLangConfig: Record<SourceLangCode, LanguageConfig> = {
	detect: { label: 'Detect Language' },
	ar: { label: 'Arabic' },
	bg: { label: 'Bulgarian' },
	cs: { label: 'Czech' },
	da: { label: 'Danish' },
	de: { label: 'German' },
	el: { label: 'Greek' },
	en: { label: 'English' },
	es: { label: 'Spanish' },
	et: { label: 'Estonian' },
	fi: { label: 'Finnish' },
	fr: { label: 'French' },
	hu: { label: 'Hungarian' },
	id: { label: 'Indonesian' },
	it: { label: 'Italian' },
	ja: { label: 'Japanese' },
	ko: { label: 'Korean' },
	lt: { label: 'Lithuanian' },
	lv: { label: 'Latvian' },
	nb: { label: 'Norwegian (Bokmål)' },
	nl: { label: 'Dutch' },
	pl: { label: 'Polish' },
	pt: { label: 'Portuguese' },
	ro: { label: 'Romanian' },
	ru: { label: 'Russian' },
	sk: { label: 'Slovak' },
	sl: { label: 'Slovenian' },
	sv: { label: 'Swedish' },
	tr: { label: 'Turkish' },
	uk: { label: 'Ukrainian' },
	zh: { label: 'Chinese (simplified)' },
}

export const targetLangConfig: Record<TargetLangCode, LanguageConfig> = {
	ar: { label: 'Arabic' },
	bg: { label: 'Bulgarian' },
	cs: { label: 'Czech' },
	da: { label: 'Danish' },
	de: { label: 'German' },
	el: { label: 'Greek' },
	'en-GB': { label: 'English (British)' },
	'en-US': { label: 'English (American)' },
	es: { label: 'Spanish' },
	et: { label: 'Estonian' },
	fi: { label: 'Finnish' },
	fr: { label: 'French' },
	hu: { label: 'Hungarian' },
	id: { label: 'Indonesian' },
	it: { label: 'Italian' },
	ja: { label: 'Japanese' },
	ko: { label: 'Korean' },
	lt: { label: 'Lithuanian' },
	lv: { label: 'Latvian' },
	nb: { label: 'Norwegian (Bokmål)' },
	nl: { label: 'Dutch' },
	pl: { label: 'Polish' },
	'pt-BR': { label: 'Portuguese (Brazilian)' },
	'pt-PT': { label: 'Portuguese (European)' },
	ro: { label: 'Romanian' },
	ru: { label: 'Russian' },
	sk: { label: 'Slovak' },
	sl: { label: 'Slovenian' },
	sv: { label: 'Swedish' },
	tr: { label: 'Turkish' },
	uk: { label: 'Ukrainian' },
	zh: { label: 'Chinese (simplified)' },
}
