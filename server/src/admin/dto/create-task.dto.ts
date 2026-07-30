import { Difficulty, TaskType } from '@prisma/client'
import { Type } from 'class-transformer'
import {
	IsArray,
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	Min,
	ValidateNested,
} from 'class-validator'
class TaskOptionInput {
	@IsString()
	@IsNotEmpty()
	text: string
	@IsOptional()
	isCorrect?: boolean
	@IsOptional()
	@IsString()
	textRu?: string
}
export class CreateTaskDto {
	@IsString()
	@IsNotEmpty()
	lessonId: string
	@IsInt()
	@Min(1)
	order: number
	@IsEnum(TaskType)
	type: TaskType
	@IsString()
	@IsNotEmpty()
	title: string
	@IsOptional()
	@IsString()
	titleRu?: string
	@IsOptional()
	@IsString()
	question?: string
	@IsOptional()
	@IsString()
	questionRu?: string
	@IsOptional()
	meta?: any
	@IsOptional()
	@IsString()
	explanation?: string
	@IsOptional()
	@IsString()
	explanationRu?: string
	@IsInt()
	@Min(0)
	@IsOptional()
	points?: number
	@IsEnum(Difficulty)
	@IsOptional()
	difficulty?: Difficulty
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => TaskOptionInput)
	@IsOptional()
	options?: TaskOptionInput[]
}
