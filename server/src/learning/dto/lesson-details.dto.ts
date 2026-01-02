import { BlockType, Difficulty, TaskType } from '@prisma/client'

export class LessonBlockDto {
	id: string
	order: number
	type: BlockType
	title?: string | null
	content: string
}

export class LessonTaskOptionDto {
	id: string
	text: string
}

export class LessonTaskDto {
	id: string
	order: number
	type: TaskType
	title: string
	question?: string | null
	points: number
	difficulty: Difficulty
	options: LessonTaskOptionDto[]
}

export class LessonDetailsDto {
	id: string
	courseTitle: string
	courseSlug: string
	order: number
	title: string
	estimatedDuration: number
	blocks: LessonBlockDto[]
	tasks: LessonTaskDto[]
}
