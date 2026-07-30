export const CONTENT_LANGUAGES = {
	en: { label: 'English', shortLabel: 'EN' },
	ru: { label: 'Русский', shortLabel: 'RU' },
} as const

export type ContentLanguage = keyof typeof CONTENT_LANGUAGES
