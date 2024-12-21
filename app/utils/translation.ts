import { type SourceLanguageCode, type TargetLanguageCode } from 'deepl-node'

export const sourceLangs = [] as const satisfies SourceLanguageCode[]
export const targetLangs = [
	'en-US',
	'zh',
	'de',
	'fr',
] as const satisfies TargetLanguageCode[]

export const sourceLangConfigs: Record<
	Extract<SourceLanguageCode, never>,
	LanguageConfig
> = {}
export const targetLangConfigs: Record<
	Extract<TargetLanguageCode, 'en-US' | 'zh' | 'de' | 'fr'>,
	LanguageConfig
> = {
	'en-US': { label: 'English' },
	zh: { label: 'Chinese' },
	de: { label: 'German' },
	fr: { label: 'French' },
}

export type LanguageConfig = {
	label: string
}
