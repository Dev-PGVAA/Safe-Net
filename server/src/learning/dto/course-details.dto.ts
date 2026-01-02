import { Difficulty } from '@prisma/client'

export interface CourseDetailsDto {
	id: string
	slug: string
	title: string
	description: string
	difficulty: Difficulty
	progress: number
	totalXp: number
	stage: {
		id: string
		slug: string
		title: string
		subtitle?: string
		icon?: string
	} | null
	lessons: Array<{
		id: string
		order: number
		title: string
		tasksCount: number
		completed: boolean
	}>
	tests: Array<{
		id: string
		title: string
		description?: string
		passingScore: number
		// completed: boolean
		// score: number
		// time: number
	}>
}
