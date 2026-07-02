import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class AdminStatsService {
	constructor(private prisma: PrismaService) {}

	async getOverviewStats() {
		const now = new Date()
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
		const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
		const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

		// Users stats
		const [totalUsers, activeUsers, blockedUsers, adminUsers] =
			await Promise.all([
				this.prisma.user.count(),
				this.prisma.user.count({ where: { status: 'ACTIVE' } }),
				this.prisma.user.count({ where: { status: 'BLOCKED' } }),
				this.prisma.user.count({
					where: {
						rights: {
							has: 'ADMIN',
						},
					},
				}),
			])

		// Content stats
		const [coursesCount, lessonsCount, tasksCount, testsCount] =
			await Promise.all([
				this.prisma.course.count(),
				this.prisma.lesson.count(),
				this.prisma.task.count(),
				this.prisma.test.count(),
			])

		// Performance stats (using the correct TaskAttempt model)
		const [totalAttempts, correctAttempts, certificates] = await Promise.all([
			this.prisma.taskAttempt.count(),
			this.prisma.taskAttempt.count({ where: { isCorrect: true } }),
			this.prisma.certificate.count(),
		])

		const averageCorrectPercent =
			totalAttempts > 0
				? Math.round((correctAttempts / totalAttempts) * 100)
				: 0

		// Registrations
		const [todayRegistrations, weekRegistrations, monthRegistrations] =
			await Promise.all([
				this.prisma.user.count({ where: { createdAt: { gte: today } } }),
				this.prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
				this.prisma.user.count({ where: { createdAt: { gte: monthAgo } } }),
			])

		// Registrations data for the chart (last 30 days)
		const registrationsData = await this.getRegistrationsChartData()

		// Top courses
		const topCourses = await this.getTopCourses()

		// Recent activity
		const recentActivity = await this.getRecentActivity()

		// User growth
		const userGrowth = await this.getUserGrowth()

		// Course stats by difficulty
		const courseStats = await this.getCourseStatsByDifficulty()

		return {
			users: {
				total: totalUsers,
				active: activeUsers,
				blocked: blockedUsers,
				admins: adminUsers,
			},
			content: {
				courses: coursesCount,
				lessons: lessonsCount,
				tasks: tasksCount,
				tests: testsCount,
			},
			performance: {
				totalAttempts,
				correctAttempts,
				averageCorrectPercent,
				certificates,
			},
			registrations: {
				today: todayRegistrations,
				week: weekRegistrations,
				month: monthRegistrations,
				data: registrationsData,
			},
			topCourses,
			recentActivity,
			userGrowth,
			courseStats,
		}
	}

	private async getRegistrationsChartData() {
		const thirtyDaysAgo = new Date()
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

		const users = await this.prisma.user.findMany({
			where: { createdAt: { gte: thirtyDaysAgo } },
			select: { createdAt: true },
			orderBy: { createdAt: 'asc' },
		})

		// Group by date
		const grouped = users.reduce(
			(acc, user) => {
				const date = user.createdAt.toISOString().split('T')[0]
				acc[date] = (acc[date] || 0) + 1
				return acc
			},
			{} as Record<string, number>
		)

		// Fill in missing days with zeros
		const result = []
		for (let i = 30; i >= 0; i--) {
			const date = new Date()
			date.setDate(date.getDate() - i)
			const dateStr = date.toISOString().split('T')[0]
			result.push({
				date: dateStr,
				count: grouped[dateStr] || 0,
			})
		}

		return result
	}

	private async getTopCourses() {
		// Get courses with progress counts
		const courses = await this.prisma.course.findMany({
			include: {
				_count: {
					select: {
						progress: true,
						certificates: true,
					},
				},
				progress: {
					select: {
						progress: true,
						totalXp: true,
					},
				},
			},
			orderBy: {
				progress: {
					_count: 'desc',
				},
			},
			take: 5,
		})

		return courses.map(course => {
			const enrolledUsers = course._count.progress
			const completedCount = course._count.certificates
			const completionRate =
				enrolledUsers > 0
					? Math.round((completedCount / enrolledUsers) * 100)
					: 0

			const avgScore =
				enrolledUsers > 0
					? Math.round(
							course.progress.reduce((sum, p) => sum + p.progress, 0) /
								enrolledUsers
						)
					: 0

			return {
				id: course.id,
				title: course.title,
				enrolledUsers,
				completionRate,
				avgScore,
			}
		})
	}

	private async getRecentActivity() {
		// Get recent registrations
		const userRegistrations = await this.prisma.user.findMany({
			take: 7,
			orderBy: { createdAt: 'desc' },
			select: {
				id: true,
				name: true,
				email: true,
				createdAt: true,
			},
		})

		// Get recently completed lessons
		const completedLessons = await this.prisma.completedLesson.findMany({
			take: 7,
			orderBy: { completedAt: 'desc' },
			include: {
				user: { select: { name: true, email: true } },
				lesson: {
					select: {
						title: true,
						course: { select: { title: true } },
					},
				},
			},
		})

		// Get recent certificates
		const certificates = await this.prisma.certificate.findMany({
			take: 6,
			orderBy: { issuedAt: 'desc' },
			include: {
				user: { select: { name: true, email: true } },
				course: { select: { title: true } },
			},
		})

		const activities = [
			...userRegistrations.map(user => ({
				id: `reg-${user.id}`,
				type: 'USER_REGISTERED' as const,
				userName: user.name || 'Unknown user',
				userEmail: user.email,
				description: 'Registered on the platform',
				timestamp: user.createdAt.toISOString(),
			})),
			...completedLessons.map(cl => ({
				id: `lesson-${cl.id}`,
				type: 'LESSON_COMPLETED' as const,
				userName: cl.user.name || 'Unknown user',
				userEmail: cl.user.email,
				description: `Completed lesson "${cl.lesson.title}" in course "${cl.lesson.course.title}"`,
				timestamp: cl.completedAt.toISOString(),
			})),
			...certificates.map(cert => ({
				id: `cert-${cert.id}`,
				type: 'CERTIFICATE_ISSUED' as const,
				userName: cert.user.name || 'Unknown user',
				userEmail: cert.user.email,
				description: `Received a certificate for course "${cert.course.title}"`,
				timestamp: cert.issuedAt.toISOString(),
			})),
		]

		return activities
			.sort(
				(a, b) =>
					new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
			)
			.slice(0, 20)
	}

	private async getUserGrowth() {
		const sixMonthsAgo = new Date()
		sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

		const users = await this.prisma.user.findMany({
			where: { createdAt: { gte: sixMonthsAgo } },
			select: { createdAt: true, status: true },
		})

		// Group by month
		const grouped = users.reduce(
			(acc, user) => {
				const period = user.createdAt.toISOString().slice(0, 7) // YYYY-MM
				if (!acc[period]) {
					acc[period] = { total: 0, active: 0, new: 0 }
				}
				acc[period].total++
				acc[period].new++
				if (user.status === 'ACTIVE') acc[period].active++
				return acc
			},
			{} as Record<string, { total: number; active: number; new: number }>
		)

		// Fill in all months (including zero months)
		const result = []
		for (let i = 5; i >= 0; i--) {
			const date = new Date()
			date.setMonth(date.getMonth() - i)
			const period = date.toISOString().slice(0, 7)
			result.push({
				period,
				total: grouped[period]?.total || 0,
				active: grouped[period]?.active || 0,
				new: grouped[period]?.new || 0,
			})
		}

		// Compute cumulative values for total and active
		let cumulativeTotal = 0
		let cumulativeActive = 0
		return result.map(item => {
			cumulativeTotal += item.new
			cumulativeActive += item.active
			return {
				...item,
				total: cumulativeTotal,
				active: cumulativeActive,
			}
		})
	}

	private async getCourseStatsByDifficulty() {
		const courses = await this.prisma.course.groupBy({
			by: ['difficulty'],
			_count: true,
		})

		const total = courses.reduce((sum, c) => sum + c._count, 0)

		return courses.map(c => ({
			difficulty: c.difficulty,
			count: c._count,
			percentage: total > 0 ? Math.round((c._count / total) * 100) : 0,
		}))
	}
}
