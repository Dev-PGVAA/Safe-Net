import { Injectable } from '@nestjs/common'
import { Role, UserStatus } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'
@Injectable()
export class AdminStatsService {
	constructor(private readonly prisma: PrismaService) {}
	async getOverview() {
		const [totalUsers, activeUsers, blockedUsers] = await Promise.all([
			this.prisma.user.count(),
			this.prisma.user.count({ where: { status: UserStatus.ACTIVE } }),
			this.prisma.user.count({ where: { status: UserStatus.BLOCKED } })
		])
		const admins = await this.prisma.user.count({
			where: { rights: { has: Role.ADMIN } }
		})
		const coursesCount = await this.prisma.course.count()
		const lessonsCount = await this.prisma.lesson.count()
		const tasksCount = await this.prisma.task.count()
		const totalAttempts = await this.prisma.taskAttempt.count()
		const correctAttempts = await this.prisma.taskAttempt.count({
			where: { isCorrect: true }
		})
		const averageScore =
			totalAttempts > 0
				? Math.round((correctAttempts / totalAttempts) * 100)
				: 0
		const totalCertificates = await this.prisma.certificate.count()
		return {
			users: {
				total: totalUsers,
				active: activeUsers,
				blocked: blockedUsers,
				admins
			},
			content: {
				courses: coursesCount,
				lessons: lessonsCount,
				tasks: tasksCount
			},
			performance: {
				totalAttempts,
				correctAttempts,
				averageCorrectPercent: averageScore,
				certificates: totalCertificates
			}
		}
	}
}
