import { Controller, Get } from '@nestjs/common'
import { Role } from '@prisma/client'
import { Auth } from '../../auth/decorators/auth.decorator'
import { CurrentLocale, Locale } from '../../i18n/locale'
import { AdminStatsService } from '../services/admin-stats.service'

@Controller('admin/stats')
@Auth(Role.ADMIN)
export class AdminStatsController {
	constructor(private readonly adminStatsService: AdminStatsService) {}

	@Get('overview')
	async getOverview(@CurrentLocale() locale: Locale) {
		return this.adminStatsService.getOverviewStats(locale)
	}
}
