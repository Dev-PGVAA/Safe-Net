import { Controller, Get, UseGuards } from '@nestjs/common'
import { Role } from '@prisma/client'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { Roles } from 'src/auth/decorators/roles.decorator'
import { RolesGuard } from 'src/auth/guard/roles.guard'
import { AdminStatsService } from '../services/admin-stats.service'
@Controller('admin/stats')
@Auth()
@Roles(Role.ADMIN)
@UseGuards(RolesGuard)
export class AdminStatsController {
	constructor(private readonly adminStatsService: AdminStatsService) {}
	@Get('overview')
	async getOverview() {
		return this.adminStatsService.getOverview()
	}
}
