import { BlockType } from '@prisma/client'
import { IsEnum, IsInt, IsOptional, IsString, IsUUID } from 'class-validator'

export class CreateBlockDto {
	@IsUUID()
	lessonId: string

	@IsInt()
	order: number

	@IsEnum(BlockType)
	type: BlockType

	@IsOptional()
	@IsString()
	title?: string
	@IsOptional()
	@IsString()
	titleRu?: string

	@IsString()
	content: string
	@IsOptional()
	@IsString()
	contentRu?: string
}
