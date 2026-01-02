import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator'
export class CreateStageDto {
	@IsInt()
	@Min(1)
	order: number
	@IsString()
	@IsNotEmpty()
	slug: string
	@IsString()
	@IsNotEmpty()
	title: string
	@IsOptional()
	@IsString()
	subtitle?: string
	@IsOptional()
	@IsString()
	icon?: string
}
