export enum Language {
	Chinese = 'chinese',
	English = 'english',
	German = 'german',
	French = 'french',
}

export const langauges = Object.values(Language)

export type LanguageConfig = {
	label: string
}
export const languageConfigs: Record<Language, LanguageConfig> = {
	[Language.Chinese]: { label: 'Chinese' },
	[Language.English]: { label: 'English' },
	[Language.German]: { label: 'German' },
	[Language.French]: { label: 'French' },
}
