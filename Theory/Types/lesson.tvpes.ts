export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'
export type CategoryId =
	| 'basics'
	| 'phishing'
	| 'websites'
	| 'passwords'
	| 'social-networks'
	| 'shopping'
	| 'social-engineering'
	| 'final-mission'
export type TaskType =
	| 'email-analysis'
	| 'url-analysis'
	| 'multiple-choice'
	| 'single-choice'
	| 'password-strength'
	| 'website-inspection'
	| 'scenario'
	| 'drag-and-drop'
	| 'true-false'
export interface Theory {
	introduction: string
	keyPoints: string[]
	warningSigns?: string[]
	examples?: {
		good?: string[]
		bad?: string[]
		legitimate?: string | string[]
		phishing?: string | string[]
		suspicious?: string[]
	}
	tips?: string[]
	commonMistakes?: string[]
}
export interface BaseTask {
	id: number
	type: TaskType
	question: string
	correctAnswer: string | string[]
	explanation: string
	hints?: string[]
	points: number
}
export interface Option {
	id: string
	text: string
	isCorrect: boolean
	explanation?: string
}
export interface EmailAnalysisTask extends BaseTask {
	type: 'email-analysis'
	email: {
		from: string
		subject: string
		body: string
		attachments?: string[]
	}
	options: Option[]
}
export interface UrlAnalysisTask extends BaseTask {
	type: 'url-analysis'
	urls: {
		id: string
		url: string
		isCorrect: boolean
	}[]
}
export interface MultipleChoiceTask extends BaseTask {
	type: 'multiple-choice'
	options: Option[]
	correctAnswers: string[]
}
export interface SingleChoiceTask extends BaseTask {
	type: 'single-choice'
	options: Option[]
}
export interface PasswordStrengthTask extends BaseTask {
	type: 'password-strength'
	passwords: {
		id: string
		password: string
		strength: 'weak' | 'medium' | 'strong'
		issues?: string[]
	}[]
}
export interface ScenarioTask extends BaseTask {
	type: 'scenario'
	scenario: string
	actions: Option[]
}
export interface WebsiteInspectionTask extends BaseTask {
	type: 'website-inspection'
	website: {
		url: string
		screenshot?: string
		description: string
		suspiciousElements: string[]
	}
	options: Option[]
}
export interface TrueFalseTask extends BaseTask {
	type: 'true-false'
	statement: string
	correctAnswer: 'true' | 'false'
}
export type Task =
	| EmailAnalysisTask
	| UrlAnalysisTask
	| MultipleChoiceTask
	| SingleChoiceTask
	| PasswordStrengthTask
	| ScenarioTask
	| WebsiteInspectionTask
	| TrueFalseTask
export interface QuizQuestion {
	id: number
	question: string
	options: string[]
	correctAnswer: number
	points: number
	explanation?: string
}
export interface Quiz {
	passingScore: number
	questions: QuizQuestion[]
}
export interface Resource {
	title: string
	url: string
	type: 'article' | 'video' | 'interactive' | 'pdf' | 'external'
	description?: string
}
export interface Lesson {
	id: number
	title: string
	category: CategoryId
	difficulty: DifficultyLevel
	points: number
	estimatedTime: string
	description: string
	icon?: string
	theory: Theory
	tasks: Task[]
	quiz: Quiz
	resources?: Resource[]
	prerequisites?: number[]
}
export interface Category {
	id: CategoryId
	name: string
	icon: string
	description: string
	taskCount: number
	color?: string
}
export interface Achievement {
	id: string
	name: string
	description: string
	icon: string
	points: number
	condition: {
		type: 'complete-lesson' | 'complete-category' | 'streak' | 'score' | 'perfect-score'
		value?: number | string
	}
}
export interface LessonsData {
	lessons: Lesson[]
	categories: Category[]
	achievements: Achievement[]
	metadata: {
		version: string
		lastUpdated: string
		totalLessons: number
		totalTasks: number
	}
}
