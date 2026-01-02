import { BlockType } from '@prisma/client'

export class LessonBlockDto {
	id: string
	order: number
	type: BlockType
	title?: string | null
	content: string
}
