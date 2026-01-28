import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'

export interface PublicStatsResponse { // ← Добавь export
	totalUsers: number
	totalTasks: number
	averageAccuracy: number
	totalLessons: number
}

@Injectable()
export class PublicService {
	constructor(private readonly prisma: PrismaService) {}

	async getStats(): Promise<PublicStatsResponse> {
		const [totalUsers, totalTasks, totalLessons, performanceStats] =
			await Promise.all([
				this.prisma.user.count({
					where: { status: 'ACTIVE' },
				}),
				this.prisma.task.count(),
				this.prisma.lesson.count(),
				this.prisma.taskAttempt.aggregate({
					_count: { id: true },
					where: { isCorrect: true },
				}),
			])

		const totalAttempts = await this.prisma.taskAttempt.count()
		const averageAccuracy =
			totalAttempts > 0
				? Math.round((performanceStats._count.id / totalAttempts) * 100)
				: 0

		return {
			totalUsers,
			totalTasks,
			averageAccuracy,
			totalLessons,
		}
	}
}
