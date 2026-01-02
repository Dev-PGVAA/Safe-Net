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
	ValidateNested
} from 'class-validator'
class TestQuestionOptionDto {
	@IsString()
	@IsNotEmpty()
	text: string
	@IsOptional()
	isCorrect?: boolean
}
export class CreateTestQuestionDto {
	@IsString()
	@IsNotEmpty()
	testId: string
	@IsInt()
	@Min(1)
	order: number
	@IsString()
	@IsNotEmpty()
	text: string
	@IsEnum(TaskType)
	type: TaskType
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => TestQuestionOptionDto)
	@IsOptional()
	options?: TestQuestionOptionDto[]
	@IsOptional()
	@IsEnum(Difficulty)
	difficulty?: Difficulty
}
