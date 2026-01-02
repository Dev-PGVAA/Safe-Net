import { Module } from '@nestjs/common'
import { AuthModule } from 'src/auth/auth.module'
import { RolesGuard } from 'src/auth/guard/roles.guard'
import { PrismaService } from 'src/prisma.service'
import { AdminLearningController } from './controllers/admin-learning.controller'
import { AdminStatsController } from './controllers/admin-stats.controller'
import { AdminUsersController } from './controllers/admin-users.controller'
import { AdminLearningService } from './services/admin-learning.service'
import { AdminStatsService } from './services/admin-stats.service'
import { AdminUsersService } from './services/admin-users.service'
@Module({
	controllers: [
		AdminLearningController,
		AdminUsersController,
		AdminStatsController
	],
	providers: [
		PrismaService,
		AdminLearningService,
		AdminUsersService,
		AdminStatsService,
		RolesGuard
	],
	imports: [AuthModule]
})
export class AdminModule {}
