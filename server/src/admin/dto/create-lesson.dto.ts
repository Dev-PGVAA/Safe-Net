import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator'
export class CreateLessonDto {
	@IsString()
	@IsNotEmpty()
	courseId: string

	@IsInt()
	@Min(1)
	order: number

	@IsString()
	@IsNotEmpty()
	title: string

	@IsString()
	@IsNotEmpty()
	estimatedDuration: number
}
