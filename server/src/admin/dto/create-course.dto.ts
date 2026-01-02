import { Difficulty } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'
export class CreateCourseDto {
	@IsString()
	@IsNotEmpty()
	stageId: string
	@IsString()
	@IsNotEmpty()
	slug: string
	@IsString()
	@IsNotEmpty()
	title: string
	@IsString()
	@IsNotEmpty()
	description: string
	@IsEnum(Difficulty)
	@IsOptional()
	difficulty?: Difficulty
}
