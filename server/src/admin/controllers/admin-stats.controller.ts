import { Controller, Get } from '@nestjs/common'
import { Auth } from '../../auth/decorators/auth.decorator'
import { Roles } from '../../auth/decorators/roles.decorator'
import { AdminStatsService } from '../services/admin-stats.service'

@Controller('admin/stats')
@Auth()
@Roles('ADMIN')
export class AdminStatsController {
	constructor(private readonly adminStatsService: AdminStatsService) {}

	@Get('overview')
	async getOverview() {
		// ✅ Fixed: calling the correct method
		return this.adminStatsService.getOverviewStats()
	}
}
