/**
 * Constants for working with tests
 * Centralized storage of magic numbers and strings
 */

export const TEST_CONSTANTS = {
	// Minimum requirements
	MIN_QUESTIONS_RECOMMENDED: 5,
	MIN_TITLE_LENGTH: 3,
	MAX_TITLE_LENGTH: 255,

	// Passing score
	DEFAULT_PASSING_SCORE: 80,
	MIN_PASSING_SCORE: 0,
	MAX_PASSING_SCORE: 100,
	PASSING_SCORE_STEP: 5,

	// Animations
	STAGGER_DELAY: 0.05,

	// Search queries
	DEBOUNCE_DELAY: 300,
} as const

export const TEST_STATUS = {
	DRAFT: 'draft',
	READY: 'ready',
} as const

export const TEST_FILTER = {
	ALL: 'all',
} as const

/**
 * Types for tests
 */
export type TestStatus = (typeof TEST_STATUS)[keyof typeof TEST_STATUS]
export type TestFilterValue = typeof TEST_FILTER.ALL | string
