import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common'
import { Role } from '@prisma/client'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { Roles } from 'src/auth/decorators/roles.decorator'
import { RolesGuard } from 'src/auth/guard/roles.guard'
import { AdminUpdateUserDto } from '../dto/update-user.dto'
import { AdminUsersService } from '../services/admin-users.service'
@Controller('admin/users')
@Auth()
@Roles(Role.ADMIN)
@UseGuards(RolesGuard)
export class AdminUsersController {
	constructor(private readonly adminUsersService: AdminUsersService) {}
	@Get()
	async getUsers() {
		return this.adminUsersService.getUsers()
	}
	@Get(':id')
	async getUser(@Param('id') id: string) {
		return this.adminUsersService.getUserById(id)
	}
	@Put(':id')
	async updateUser(@Param('id') id: string, @Body() dto: AdminUpdateUserDto) {
		return this.adminUsersService.updateUser(id, dto)
	}
}
