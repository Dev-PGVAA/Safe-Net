'use client'

import {
	CONTENT_LANGUAGES,
	type ContentLanguage,
} from '@/config/content-language.config'

interface ContentLanguageToggleProps {
	value: ContentLanguage
	onChange: (language: ContentLanguage) => void
}

export function ContentLanguageToggle({
	value,
	onChange,
}: ContentLanguageToggleProps) {
	return (
		<div
			className='inline-flex rounded-xl border border-white/10 bg-white/[0.03] p-1'
			aria-label='Content language'
		>
			{(Object.keys(CONTENT_LANGUAGES) as ContentLanguage[]).map(language => (
				<button
					key={language}
					type='button'
					onClick={() => onChange(language)}
					aria-pressed={value === language}
					className={
						value === language
							? 'rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-black shadow-sm'
							: 'rounded-lg px-3 py-1.5 text-sm font-medium text-gray-400 transition-colors hover:text-white'
					}
				>
					{CONTENT_LANGUAGES[language].label}
				</button>
			))}
		</div>
	)
}
