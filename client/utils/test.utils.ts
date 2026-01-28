import { TEST_CONSTANTS } from '@/constants/tests.constants'

/**
 * Определяет статус теста на основе количества вопросов
 */
export const getTestStatus = (questionsCount: number): 'ready' | 'draft' => {
	return questionsCount > 0 ? 'ready' : 'draft'
}

/**
 * Возвращает локализованное склонение для числа вопросов
 * @example getQuestionsLabel(1) // "1 вопрос"
 * @example getQuestionsLabel(5) // "5 вопросов"
 */
export const getQuestionsLabel = (count: number): string => {
	const lastDigit = count % 10
	const lastTwoDigits = count % 100

	if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
		return `${count} вопросов`
	}

	if (lastDigit === 1) {
		return `${count} вопрос`
	}

	if (lastDigit >= 2 && lastDigit <= 4) {
		return `${count} вопроса`
	}

	return `${count} вопросов`
}

/**
 * Валидация названия теста
 */
export const validateTestTitle = (title: string): boolean => {
	return (
		title.length >= TEST_CONSTANTS.MIN_TITLE_LENGTH &&
		title.length <= TEST_CONSTANTS.MAX_TITLE_LENGTH
	)
}

/**
 * Проверяет, нужно ли показывать предупреждение о недостатке вопросов
 */
export const shouldShowLowQuestionsWarning = (
	questionsCount: number
): boolean => {
	return (
		questionsCount > 0 &&
		questionsCount < TEST_CONSTANTS.MIN_QUESTIONS_RECOMMENDED
	)
}
