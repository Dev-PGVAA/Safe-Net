import { IsArray, IsOptional, IsString } from 'class-validator'
export class AnswerTaskDto {
	@IsArray()
	@IsString({ each: true })
	selectedOptionIds: string[] = []
	@IsOptional()
	@IsString()
	textAnswer?: string
}
