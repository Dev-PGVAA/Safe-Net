import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard'
import { AchievementsService } from '../services/achievements.service'

@Controller('learning/achievements')
@UseGuards(JwtAuthGuard)
export class AchievementsController {
	constructor(private readonly achievementsService: AchievementsService) {}

	@Get()
	async getUserAchievements(@CurrentUser('id') userId: string) {
		return this.achievementsService.getUserAchievements(userId)
	}

	@Get('all')
	async getAllAchievements() {
		return this.achievementsService.getAllAchievements()
	}

	@Get(':id')
	async getAchievementById(@Param('id') id: string) {
		return this.achievementsService.getAchievementById(id)
	}
}
