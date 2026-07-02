import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class AchievementsService {
	constructor(private readonly prisma: PrismaService) {}

	async getUserAchievements(userId: string) {
		const achievements = await this.prisma.userAchievement.findMany({
			where: { userId },
			include: {
				achievement: true,
			},
			orderBy: {
				earnedAt: 'desc',
			},
		})

		return achievements.map(ua => ({
			id: ua.id,
			earnedAt: ua.earnedAt.toISOString(),
			achievement: {
				id: ua.achievement.id,
				code: ua.achievement.code,
				title: ua.achievement.title,
				description: ua.achievement.description,
				icon: ua.achievement.icon,
			},
		}))
	}

	async getAllAchievements() {
		return this.prisma.achievement.findMany({
			orderBy: { createdAt: 'asc' },
		})
	}

	async getAchievementById(id: string) {
		const achievement = await this.prisma.achievement.findUnique({
			where: { id },
		})

		if (!achievement) {
			throw new NotFoundException('Achievement not found')
		}

		return achievement
	}

	async awardAchievement(
		userId: string,
		achievementCode: string
	): Promise<boolean> {
		const achievement = await this.prisma.achievement.findUnique({
			where: { code: achievementCode },
		})

		if (!achievement) {
			return false
		}

		const existingAward = await this.prisma.userAchievement.findUnique({
			where: {
				userId_achievementId: {
					userId,
					achievementId: achievement.id,
				},
			},
		})

		if (existingAward) {
			return false
		}

		await this.prisma.userAchievement.create({
			data: {
				userId,
				achievementId: achievement.id,
			},
		})

		return true
	}

	async checkAndAwardAchievements(userId: string): Promise<string[]> {
		const awardedCodes: string[] = []

		// 1. First login - awarded during registration (called separately)
		// This achievement should be called in auth.service.ts after user creation

		// 2. First lesson - completed the first lesson
		const firstCompletedLesson = await this.prisma.completedLesson.findFirst({
			where: { userId },
		})
		if (firstCompletedLesson) {
			const awarded = await this.awardAchievement(userId, 'FIRST_LESSON')
			if (awarded) awardedCodes.push('FIRST_LESSON')
		}

		// 3. Phishing master - completed the phishing course
		const phishingCourse = await this.prisma.course.findFirst({
			where: {
				OR: [
					{ slug: { contains: 'phishing' } },
					{ title: { contains: 'phishing', mode: 'insensitive' } },
				],
			},
		})
		if (phishingCourse) {
			const phishingCert = await this.prisma.certificate.findFirst({
				where: {
					userId,
					courseId: phishingCourse.id,
				},
			})
			if (phishingCert) {
				const awarded = await this.awardAchievement(userId, 'PHISHING_MASTER')
				if (awarded) awardedCodes.push('PHISHING_MASTER')
			}
		}

		// 4. Password expert - completed all password courses
		const passwordCourses = await this.prisma.course.findMany({
			where: {
				OR: [
					{ slug: { contains: 'password' } },
					{ title: { contains: 'password', mode: 'insensitive' } },
				],
			},
		})
		if (passwordCourses.length > 0) {
			const passwordCerts = await this.prisma.certificate.count({
				where: {
					userId,
					courseId: { in: passwordCourses.map(c => c.id) },
				},
			})
			if (passwordCerts === passwordCourses.length) {
				const awarded = await this.awardAchievement(userId, 'PASSWORD_EXPERT')
				if (awarded) awardedCodes.push('PASSWORD_EXPERT')
			}
		}

		// 5. Security novice - completed the first stage (all stage-1 courses)
		await this.checkStageCompletion(userId, 1, 'SECURITY_NOVICE', awardedCodes)

		// 6. Advanced user - completed 4 stages
		const completedStages = await this.getCompletedStagesCount(userId)
		if (completedStages >= 4) {
			const awarded = await this.awardAchievement(userId, 'ADVANCED_USER')
			if (awarded) awardedCodes.push('ADVANCED_USER')
		}

		// 7. Security expert - completed all 8 stages
		if (completedStages >= 8) {
			const awarded = await this.awardAchievement(userId, 'SECURITY_EXPERT')
			if (awarded) awardedCodes.push('SECURITY_EXPERT')
		}

		// 8. Perfect score - solved 50 tasks in a row without a mistake
		const perfectStreak = await this.checkPerfectStreak(userId, 50)
		if (perfectStreak) {
			const awarded = await this.awardAchievement(userId, 'PERFECT_STREAK')
			if (awarded) awardedCodes.push('PERFECT_STREAK')
		}

		// 9. Fast learner - completed a course in 1 day
		const fastCourse = await this.checkFastCourseCompletion(userId)
		if (fastCourse) {
			const awarded = await this.awardAchievement(userId, 'FAST_LEARNER')
			if (awarded) awardedCodes.push('FAST_LEARNER')
		}

		// 10. Certified - earned the first certificate
		const firstCertificate = await this.prisma.certificate.findFirst({
			where: { userId },
		})
		if (firstCertificate) {
			const awarded = await this.awardAchievement(userId, 'CERTIFIED')
			if (awarded) awardedCodes.push('CERTIFIED')
		}

		return awardedCodes
	}

	// Check stage completion
	private async checkStageCompletion(
		userId: string,
		stageOrder: number,
		achievementCode: string,
		awardedCodes: string[]
	): Promise<void> {
		const stage = await this.prisma.stage.findFirst({
			where: { order: stageOrder },
			include: {
				courses: {
					select: { id: true },
				},
			},
		})

		if (stage && stage.courses.length > 0) {
			const stageCerts = await this.prisma.certificate.count({
				where: {
					userId,
					courseId: { in: stage.courses.map(c => c.id) },
				},
			})

			if (stageCerts === stage.courses.length) {
				const awarded = await this.awardAchievement(userId, achievementCode)
				if (awarded) awardedCodes.push(achievementCode)
			}
		}
	}

	// Count completed stages
	private async getCompletedStagesCount(userId: string): Promise<number> {
		const stages = await this.prisma.stage.findMany({
			include: {
				courses: {
					select: { id: true },
				},
			},
		})

		let completedCount = 0

		for (const stage of stages) {
			if (stage.courses.length === 0) continue

			const stageCerts = await this.prisma.certificate.count({
				where: {
					userId,
					courseId: { in: stage.courses.map(c => c.id) },
				},
			})

			if (stageCerts === stage.courses.length) {
				completedCount++
			}
		}

		return completedCount
	}

	// Check for a streak of 50 correct answers in a row
	private async checkPerfectStreak(
		userId: string,
		targetStreak: number
	): Promise<boolean> {
		const attempts = await this.prisma.taskAttempt.findMany({
			where: { userId },
			orderBy: { createdAt: 'desc' },
			take: targetStreak,
		})

		if (attempts.length < targetStreak) {
			return false
		}

		return attempts.every(attempt => attempt.isCorrect)
	}

	// Check for fast course completion (within 1 day)
	private async checkFastCourseCompletion(userId: string): Promise<boolean> {
		const certificates = await this.prisma.certificate.findMany({
			where: { userId },
			include: {
				course: {
					include: {
						lessons: {
							include: {
								_count: {
									select: { tasks: true },
								},
							},
						},
					},
				},
			},
		})

		for (const cert of certificates) {
			// Get the first and last task attempt in this course
			const attempts = await this.prisma.taskAttempt.findMany({
				where: {
					userId,
					task: {
						lesson: {
							courseId: cert.courseId,
						},
					},
				},
				orderBy: { createdAt: 'asc' },
			})

			if (attempts.length > 0) {
				const firstAttempt = attempts[0]
				const lastAttempt = attempts[attempts.length - 1]

				const timeDiff =
					lastAttempt.createdAt.getTime() - firstAttempt.createdAt.getTime()
				const dayInMs = 24 * 60 * 60 * 1000

				if (timeDiff <= dayInMs) {
					return true
				}
			}
		}

		return false
	}
}
