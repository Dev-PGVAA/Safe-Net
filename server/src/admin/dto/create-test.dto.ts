import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
export class CreateTestDto {
	@IsOptional()
	@IsString()
	courseId?: string
	@IsString()
	@IsNotEmpty()
	title: string
	@IsOptional()
	@IsString()
	description?: string
	@IsOptional()
	@IsString()
	titleRu?: string
	@IsOptional()
	@IsString()
	descriptionRu?: string
}
