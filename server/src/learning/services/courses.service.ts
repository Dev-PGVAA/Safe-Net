import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'
import { CourseDetailsDto } from '../dto/course-details.dto'
import { CourseSummaryDto } from '../dto/course-summary.dto'

@Injectable()
export class CoursesService {
	constructor(private readonly prisma: PrismaService) {}

	async getCoursesByStage(slug: string): Promise<CourseSummaryDto[]> {
		const stage = await this.prisma.stage.findUnique({
			where: { slug },
			include: {
				courses: {
					include: {
						lessons: {
							select: { id: true },
						},
					},
					orderBy: { createdAt: 'asc' },
				},
			},
		})
		if (!stage) {
			throw new NotFoundException('Stage not found')
		}
		return stage.courses.map(course => ({
			id: course.id,
			slug: course.slug,
			title: course.title,
			description: course.description,
			difficulty: course.difficulty,
			lessonsCount: course.lessons.length,
		}))
	}

	async getCourseBySlug(
		slug: string,
		userId: string
	): Promise<CourseDetailsDto> {
		const course = await this.prisma.course.findUnique({
			where: { slug },
			include: {
				stage: {
					select: {
						id: true,
						slug: true,
						title: true,
						subtitle: true,
						icon: true,
					},
				},
				lessons: {
					orderBy: { order: 'asc' },
					select: {
						id: true,
						order: true,
						title: true,
						estimatedDuration: true,
						_count: {
							select: { tasks: true },
						},
					},
				},
				tests: {
					select: {
						id: true,
						title: true,
						description: true,
						passingScore: true,
					},
				},
			},
		})

		if (!course) {
			throw new NotFoundException('Course not found')
		}

		const testResults = await this.prisma.testResult.findMany({
			where: {
				userId,
				test: {
					courseId: course.id,
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		})

		const [userCourseProgress, completedLessons, taskAttempts] =
			await Promise.all([
				this.prisma.courseProgress.findUnique({
					where: {
						userId_courseId: {
							userId: userId,
							courseId: course.id,
						},
					},
					select: {
						progress: true,
						totalXp: true,
					},
				}),
				this.prisma.completedLesson.findMany({
					where: {
						userId: userId,
						lessonId: { in: course.lessons.map(l => l.id) },
					},
					select: { lessonId: true },
				}),
				this.prisma.taskAttempt.findMany({
					where: {
						userId: userId,
						task: {
							lesson: {
								courseId: course.id,
							},
						},
						isCorrect: true,
					},
					select: {
						awardedXp: true,
						taskId: true,
						task: {
							select: {
								lessonId: true,
							},
						},
					},
				}),
			])

		const completedLessonIds = new Set(completedLessons.map(cl => cl.lessonId))

		const lessonTaskStats = new Map<
			string,
			{ completedTasks: number; totalTasks: number }
		>()

		for (const lesson of course.lessons) {
			lessonTaskStats.set(lesson.id, {
				completedTasks: 0,
				totalTasks: lesson._count.tasks,
			})
		}

		const lessonTaskProgress = new Map<string, number>()
		taskAttempts.forEach(attempt => {
			const lessonId = attempt.task.lessonId
			lessonTaskProgress.set(
				lessonId,
				(lessonTaskProgress.get(lessonId) || 0) + 1
			)
		})

		for (const lesson of course.lessons) {
			const completedTasks = lessonTaskProgress.get(lesson.id) || 0
			lessonTaskStats.set(lesson.id, {
				completedTasks,
				totalTasks: lesson._count.tasks,
			})
		}

		const calculatedTotalXp = taskAttempts.reduce(
			(sum, attempt) => sum + (attempt.awardedXp || 0),
			0
		)

		// ✅ ИСПРАВЛЕНО: Простой расчет прогресса
		// (выполненные уроки + пройденные тесты) / (всего уроков + всего тестов) * 100
		const totalLessons = course.lessons.length
		const totalTests = course.tests.length
		const totalItems = totalLessons + totalTests

		// ✅ ИСПРАВЛЕНО: Получаем уникальные пройденные тесты (только последние попытки)
		const passedTestIds = new Set<string>()
		const testResultsByTestId = new Map<string, (typeof testResults)[0]>()

		// Группируем результаты по testId, оставляя только последний (самый свежий)
		testResults.forEach(result => {
			if (!testResultsByTestId.has(result.testId)) {
				testResultsByTestId.set(result.testId, result)
				if (result.passed) {
					passedTestIds.add(result.testId)
				}
			}
		})

		const completedItems = completedLessons.length + passedTestIds.size

		const calculatedProgress =
			totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

		return {
			id: course.id,
			slug: course.slug,
			title: course.title,
			description: course.description,
			difficulty: course.difficulty,
			progress: calculatedProgress, // ✅ Используем исправленный прогресс
			totalXp: userCourseProgress?.totalXp ?? calculatedTotalXp,
			stage: course.stage
				? {
						id: course.stage.id,
						slug: course.stage.slug,
						title: course.stage.title,
						subtitle: course.stage.subtitle,
						icon: course.stage.icon,
					}
				: null,
			lessons: course.lessons.map(lesson => {
				const taskStats = lessonTaskStats.get(lesson.id)!
				return {
					id: lesson.id,
					order: lesson.order,
					title: lesson.title,
					estimatedDuration: lesson.estimatedDuration,
					tasksCount: lesson._count.tasks,
					completed: completedLessonIds.has(lesson.id),
					taskProgress:
						lesson._count.tasks > 0
							? Math.round(
									(taskStats.completedTasks / taskStats.totalTasks) * 100
								)
							: 0,
				}
			}),
			tests: course.tests.map(test => {
				// ✅ ИСПРАВЛЕНО: Берем последний результат для каждого теста
				const result = testResultsByTestId.get(test.id)
				const allAttemptsForTest = testResults.filter(r => r.testId === test.id)

				return {
					id: test.id,
					title: test.title,
					description: test.description ?? '',
					passingScore: test.passingScore,
					passed: result?.passed ?? false,
					score: result?.score ?? null,
					time: result?.time ?? null,
					attempts: allAttemptsForTest.length,
					lastAttemptDate: result?.createdAt ?? null, // Последняя попытка
				}
			}),
		}
	}
}
