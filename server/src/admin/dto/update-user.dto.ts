import { Role, UserStatus } from '@prisma/client'
import { IsArray, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator'
export class AdminUpdateUserDto {
	@IsOptional()
	@IsEmail()
	email?: string
	@IsOptional()
	@IsString()
	name?: string
	@IsOptional()
	@IsEnum(UserStatus)
	status?: UserStatus
	@IsOptional()
	@IsArray()
	@IsEnum(Role, { each: true })
	rights?: Role[]
}
