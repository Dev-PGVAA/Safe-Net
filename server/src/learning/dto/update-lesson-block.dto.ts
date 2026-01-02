import { BlockType } from '@prisma/client'
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator'

export class UpdateLessonBlockDto {
	@IsInt()
	@Min(1)
	@IsOptional()
	order?: number

	@IsEnum(BlockType)
	@IsOptional()
	type?: BlockType

	@IsString()
	@IsOptional()
	title?: string

	@IsString()
	@IsOptional()
	content?: string
}
