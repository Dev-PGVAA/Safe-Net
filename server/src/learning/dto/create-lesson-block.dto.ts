import { BlockType } from '@prisma/client'
import {
	IsEnum,
	IsInt,
	IsOptional,
	IsString,
	IsUUID,
	Min,
} from 'class-validator'

export class CreateLessonBlockDto {
	@IsUUID()
	lessonId: string

	@IsInt()
	@Min(1)
	order: number

	@IsEnum(BlockType)
	@IsOptional()
	type?: BlockType

	@IsString()
	@IsOptional()
	title?: string

	@IsString()
	content: string
}
