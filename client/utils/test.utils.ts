import { TEST_CONSTANTS } from '@/constants/tests.constants'

/**
 * Determines the test status based on the number of questions
 */
export const getTestStatus = (questionsCount: number): 'ready' | 'draft' => {
	return questionsCount > 0 ? 'ready' : 'draft'
}

/**
 * Returns the pluralized label for the number of questions
 * @example getQuestionsLabel(1) // "1 question"
 * @example getQuestionsLabel(5) // "5 questions"
 */
export const getQuestionsLabel = (count: number): string => {
	const lastDigit = count % 10
	const lastTwoDigits = count % 100

	if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
		return `${count} questions`
	}

	if (lastDigit === 1) {
		return `${count} question`
	}

	if (lastDigit >= 2 && lastDigit <= 4) {
		return `${count} questions`
	}

	return `${count} questions`
}

/**
 * Test title validation
 */
export const validateTestTitle = (title: string): boolean => {
	return (
		title.length >= TEST_CONSTANTS.MIN_TITLE_LENGTH &&
		title.length <= TEST_CONSTANTS.MAX_TITLE_LENGTH
	)
}

/**
 * Checks whether a low-questions warning should be shown
 */
export const shouldShowLowQuestionsWarning = (
	questionsCount: number
): boolean => {
	return (
		questionsCount > 0 &&
		questionsCount < TEST_CONSTANTS.MIN_QUESTIONS_RECOMMENDED
	)
}
