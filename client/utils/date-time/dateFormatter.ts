export type DateFormatPreset =
	| 'full'
	| 'long'
	| 'medium'
	| 'short'
	| 'date-full'
	| 'date-long'
	| 'date-medium'
	| 'date-short'
	| 'time-full'
	| 'time-medium'
	| 'time-short'
	| 'iso'
	| 'relative'
	| 'custom'

export interface DateFormatOptions {
	format?: DateFormatPreset
	locale?: string
	timeZone?: string
	customOptions?: Intl.DateTimeFormatOptions
	gracefulFail?: boolean
}

const formatterCache = new Map<string, Intl.DateTimeFormat>()

const PRESET_OPTIONS: Record<
	Exclude<DateFormatPreset, 'custom' | 'iso' | 'relative'>,
	Intl.DateTimeFormatOptions
> = {
	full: {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		timeZoneName: 'short',
	},
	long: {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	},
	medium: {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	},
	short: {
		year: '2-digit',
		month: 'numeric',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	},
	'date-full': {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	},
	'date-long': {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	},
	'date-medium': {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	},
	'date-short': {
		year: '2-digit',
		month: 'numeric',
		day: 'numeric',
	},
	'time-full': {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		timeZoneName: 'long',
	},
	'time-medium': {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	},
	'time-short': {
		hour: '2-digit',
		minute: '2-digit',
	},
}

function normalizeDate(date: Date | string | number): Date | null {
	if (date instanceof Date) {
		return isNaN(date.getTime()) ? null : date
	}

	if (typeof date === 'string' || typeof date === 'number') {
		const parsed = new Date(date)
		return isNaN(parsed.getTime()) ? null : parsed
	}

	return null
}

function getCacheKey(
	locale: string,
	timeZone: string | undefined,
	options: Intl.DateTimeFormatOptions
): string {
	return `${locale}-${timeZone || 'default'}-${JSON.stringify(options)}`
}

function getFormatter(
	locale: string,
	options: Intl.DateTimeFormatOptions
): Intl.DateTimeFormat {
	const cacheKey = getCacheKey(locale, options.timeZone, options)

	let formatter = formatterCache.get(cacheKey)

	if (!formatter) {
		formatter = new Intl.DateTimeFormat(locale, options)
		formatterCache.set(cacheKey, formatter)
	}

	return formatter
}

function getSystemTimeZone(): string {
	return Intl.DateTimeFormat().resolvedOptions().timeZone
}

const RELATIVE_TIME_UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
	['year', 31536000000],
	['month', 2592000000],
	['week', 604800000],
	['day', 86400000],
	['hour', 3600000],
	['minute', 60000],
	['second', 1000],
]

function formatRelativeTime(date: Date, locale: string): string {
	const now = Date.now()
	const diff = date.getTime() - now
	const absDiff = Math.abs(diff)

	for (const [unit, threshold] of RELATIVE_TIME_UNITS) {
		if (absDiff >= threshold) {
			const value = Math.round(diff / threshold)
			const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
			return formatter.format(value, unit)
		}
	}

	return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(
		0,
		'second'
	)
}

export function formatDate(
	date: Date | string | number,
	options: DateFormatOptions = {}
): string | null {
	const {
		format = 'medium',
		locale = 'ru-RU',
		timeZone = getSystemTimeZone(),
		customOptions,
		gracefulFail = true,
	} = options

	const normalizedDate = normalizeDate(date)

	if (!normalizedDate) {
		if (gracefulFail) {
			return null
		}
		throw new Error(`Invalid date input: ${date}`)
	}

	if (format === 'iso') {
		return normalizedDate.toISOString()
	}

	if (format === 'relative') {
		return formatRelativeTime(normalizedDate, locale)
	}

	let formatOptions: Intl.DateTimeFormatOptions

	if (format === 'custom') {
		if (!customOptions) {
			throw new Error('customOptions must be provided when format is "custom"')
		}
		formatOptions = customOptions
	} else {
		formatOptions = PRESET_OPTIONS[format]
	}

	formatOptions = { ...formatOptions, timeZone }

	const formatter = getFormatter(locale, formatOptions)
	return formatter.format(normalizedDate)
}

export function toISO(date: Date | string | number): string | null {
	return formatDate(date, { format: 'iso' })
}

export function toRelative(
	date: Date | string | number,
	locale = 'ru-RU'
): string | null {
	return formatDate(date, { format: 'relative', locale })
}

export function toShortDate(
	date: Date | string | number,
	options?: Pick<DateFormatOptions, 'locale' | 'timeZone'>
): string | null {
	return formatDate(date, { ...options, format: 'date-short' })
}

export function toLongDate(
	date: Date | string | number,
	options?: Pick<DateFormatOptions, 'locale' | 'timeZone'>
): string | null {
	return formatDate(date, { ...options, format: 'date-long' })
}

export function toTime(
	date: Date | string | number,
	options?: Pick<DateFormatOptions, 'locale' | 'timeZone'>
): string | null {
	return formatDate(date, { ...options, format: 'time-short' })
}

export function clearFormatterCache(): void {
	formatterCache.clear()
}

export function getFormatterCacheSize(): number {
	return formatterCache.size
}
