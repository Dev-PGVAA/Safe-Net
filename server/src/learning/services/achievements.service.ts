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

		// 1. Первый вход - при регистрации (вызывается отдельно)
		// Эту ачивку нужно вызывать в auth.service.ts после создания пользователя

		// 2. Первый урок - завершили первый урок
		const firstCompletedLesson = await this.prisma.completedLesson.findFirst({
			where: { userId },
		})
		if (firstCompletedLesson) {
			const awarded = await this.awardAchievement(userId, 'FIRST_LESSON')
			if (awarded) awardedCodes.push('FIRST_LESSON')
		}

		// 3. Мастер фишинга - прошли курс по фишингу
		const phishingCourse = await this.prisma.course.findFirst({
			where: {
				OR: [
					{ slug: { contains: 'phishing' } },
					{ title: { contains: 'фишинг' } },
					{ title: { contains: 'Фишинг' } },
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

		// 4. Эксперт паролей - завершили все курсы по паролям
		const passwordCourses = await this.prisma.course.findMany({
			where: {
				OR: [
					{ slug: { contains: 'password' } },
					{ title: { contains: 'пароль' } },
					{ title: { contains: 'Пароль' } },
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

		// 5. Новичок безопасности - прошли первый этап (все курсы 1-го этапа)
		await this.checkStageCompletion(userId, 1, 'SECURITY_NOVICE', awardedCodes)

		// 6. Продвинутый пользователь - прошли 4 этапа
		const completedStages = await this.getCompletedStagesCount(userId)
		if (completedStages >= 4) {
			const awarded = await this.awardAchievement(userId, 'ADVANCED_USER')
			if (awarded) awardedCodes.push('ADVANCED_USER')
		}

		// 7. Эксперт безопасности - прошли все 8 этапов
		if (completedStages >= 8) {
			const awarded = await this.awardAchievement(userId, 'SECURITY_EXPERT')
			if (awarded) awardedCodes.push('SECURITY_EXPERT')
		}

		// 8. Идеальный результат - решили 50 заданий подряд без ошибок
		const perfectStreak = await this.checkPerfectStreak(userId, 50)
		if (perfectStreak) {
			const awarded = await this.awardAchievement(userId, 'PERFECT_STREAK')
			if (awarded) awardedCodes.push('PERFECT_STREAK')
		}

		// 9. Быстрый ученик - завершили курс за 1 день
		const fastCourse = await this.checkFastCourseCompletion(userId)
		if (fastCourse) {
			const awarded = await this.awardAchievement(userId, 'FAST_LEARNER')
			if (awarded) awardedCodes.push('FAST_LEARNER')
		}

		// 10. Сертифицированный - получили первый сертификат
		const firstCertificate = await this.prisma.certificate.findFirst({
			where: { userId },
		})
		if (firstCertificate) {
			const awarded = await this.awardAchievement(userId, 'CERTIFIED')
			if (awarded) awardedCodes.push('CERTIFIED')
		}

		return awardedCodes
	}

	// Проверка завершения этапа
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

	// Подсчет завершенных этапов
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

	// Проверка серии из 50 правильных ответов подряд
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

	// Проверка быстрого прохождения курса (за 1 день)
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
			// Получаем первую и последнюю попытку задания в этом курсе
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
