export enum Difficulty {
	EASY = 'EASY',
	MEDIUM = 'MEDIUM',
	HARD = 'HARD',
}

export const DifficultyLabel: Record<Difficulty, string> = {
	[Difficulty.EASY]: 'Лёгкий',
	[Difficulty.MEDIUM]: 'Средний',
	[Difficulty.HARD]: 'Сложный',
}

export interface IStage {
	id: string
	slug: string
	title: string
	subtitle?: string | null
	icon?: string | null
	coursesCount: number
	totalLessons: number
}
export interface IUserCourse {
	id: string
	slug: string
	title: string
	description: string
	progress: number
	totalXp: number
	completed: boolean
	stageTitle?: string
}
export interface ICourseDetail {
	id: string
	slug: string
	title: string
	description: string
	difficulty: Difficulty
	progress: number
	totalXp: number
	stage: IStage
	lessons: Array<{
		id: string
		title: string
		order: number
		tasksCount: number
		completed: boolean
	}>
	tests: Array<{
		score: any
		id: string
		title: string
		passingScore: number
	}>
}

export interface ILessonBlock {
	id: string
	order: number
	type: 'THEORY' // BlockType enum
	title?: string | null
	content: string
}

export interface ILesson {
	id: string
	courseTitle: string
	courseSlug: string
	order: number
	title: string
	estimatedDuration: number
	blocks: ILessonBlock[]
	tasks?: Array<ITask>
}

export interface ITask {
	id: string
	order: number
	type: 'SINGLE_CHOICE'
	title: string
	question: string
	points: number
	difficulty: 'EASY' | 'MEDIUM' | 'HARD'
	options: Array<ITaskOption>
	completed?: boolean
}

export interface ITaskOption {
	id: string
	text: string
}

export interface ITestQuestion {
	id: string
	order: number
	type: 'SINGLE_CHOICE' | 'MULTI_CHOICE' | 'TEXT_INPUT' | 'SHORT_ANSWER'
	text: string
	options?: Array<{
		id: string
		text: string
	}>
}

export interface ITest {
	id: string
	title: string
	description?: string
	courseTitle?: string
	courseSlug?: string
	passingScore: number
	totalPoints?: number
	questions: ITestQuestion[]
	course?: {
		id: string
		title: string
		slug?: string
	}
}

export interface ITestResult {
	testId: string
	score: number
	totalPoints: number
	passed: boolean
	correctAnswers: number
	totalQuestions: number
	certificateIssued?: boolean
	answers: Array<{
		questionId: string
		isCorrect: boolean
		selectedOptions?: string[]
		correctOptions?: string[]
	}>
}

export interface ITestAnswer {
	questionId: string
	selectedOptionIds?: string[]
	textAnswer?: string
}

export interface ICertificateListItem {
	id: string
	certificateNumber: string
	courseId: string
	courseTitle: string
	courseSlug?: string
	issuedAt: string
}

export interface ICertificate {
	id: string
	certificateNumber: string
	userId: string
	courseId: string
	issuedAt: string
	user: {
		id: string
		name: string
		email: string
	}
	course: {
		id: string
		title: string
		description: string
		difficulty: Difficulty
	}
}
