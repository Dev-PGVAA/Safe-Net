import { Injectable, NotFoundException } from '@nestjs/common'
import { Difficulty } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'
import { CreateCourseDto } from '../dto/create-course.dto'
import { CreateLessonDto } from '../dto/create-lesson.dto'
import { CreateStageDto } from '../dto/create-stage.dto'
import { CreateTaskDto } from '../dto/create-task.dto'
import { CreateTestQuestionDto } from '../dto/create-test-question.dto'
import { CreateTestDto } from '../dto/create-test.dto'

@Injectable()
export class AdminLearningService {
	constructor(private readonly prisma: PrismaService) {}

	getStages() {
		return this.prisma.stage.findMany({
			orderBy: { order: 'asc' },
			include: {
				courses: {
					select: {
						id: true,
						title: true,
						slug: true,
					},
				},
			},
		})
	}

	createStage(dto: CreateStageDto) {
		return this.prisma.stage.create({
			data: {
				order: dto.order,
				slug: dto.slug,
				title: dto.title,
				subtitle: dto.subtitle,
				icon: dto.icon,
			},
		})
	}

	async createCourse(dto: CreateCourseDto) {
		const stage = await this.prisma.stage.findUnique({
			where: { id: dto.stageId },
		})

		if (!stage) throw new NotFoundException('Stage not found')

		return this.prisma.course.create({
			data: {
				stageId: dto.stageId,
				slug: dto.slug,
				title: dto.title,
				description: dto.description,
				difficulty: dto.difficulty ?? Difficulty.MEDIUM,
			},
		})
	}

	async createLesson(dto: CreateLessonDto) {
		const course = await this.prisma.course.findUnique({
			where: { id: dto.courseId },
		})

		if (!course) throw new NotFoundException('Course not found')

		const estimatedDuration =
			dto.estimatedDuration ?? this.calculateEstimatedDuration(0, 0)

		return this.prisma.lesson.create({
			data: {
				courseId: dto.courseId,
				order: dto.order,
				title: dto.title,
				estimatedDuration, // ✅ Добавлено
			},
		})
	}

	async createTask(dto: CreateTaskDto) {
		const lesson = await this.prisma.lesson.findUnique({
			where: { id: dto.lessonId },
			include: {
				blocks: true,
				tasks: true,
			},
		})

		if (!lesson) throw new NotFoundException('Lesson not found')

		const task = await this.prisma.task.create({
			data: {
				lessonId: dto.lessonId,
				order: dto.order,
				type: dto.type,
				title: dto.title,
				question: dto.question,
				meta: dto.meta ?? null,
				explanation: dto.explanation,
				points: dto.points ?? 10,
				difficulty: dto.difficulty ?? Difficulty.MEDIUM,
				options: dto.options
					? {
							create: dto.options.map((o, index) => ({
								order: index + 1,
								text: o.text,
								isCorrect: o.isCorrect ?? false,
							})),
						}
					: undefined,
			},
			include: {
				options: true,
			},
		})

		// Пересчитываем время урока после добавления задачи
		const newEstimatedDuration = this.calculateEstimatedDuration(
			lesson.blocks.length,
			lesson.tasks.length + 1 // +1 новая задача
		)

		await this.prisma.lesson.update({
			where: { id: dto.lessonId },
			data: {
				estimatedDuration: newEstimatedDuration,
			},
		})

		return task
	}

	async createTest(dto: CreateTestDto) {
		return this.prisma.test.create({
			data: {
				title: dto.title,
				description: dto.description,
				courseId: dto.courseId || null,
			},
		})
	}

	async createTestQuestion(dto: CreateTestQuestionDto) {
		const test = await this.prisma.test.findUnique({
			where: { id: dto.testId },
		})

		if (!test) throw new NotFoundException('Test not found')

		return this.prisma.testQuestion.create({
			data: {
				testId: dto.testId,
				order: dto.order,
				text: dto.text,
				type: dto.type,
				options: dto.options
					? {
							create: dto.options.map((o, index) => ({
								order: index + 1,
								text: o.text,
								isCorrect: o.isCorrect ?? false,
							})),
						}
					: undefined,
			},
		})
	}

	async deleteCourse(id: string) {
		return this.prisma.course.delete({ where: { id } })
	}

	async deleteLesson(id: string) {
		return this.prisma.lesson.delete({ where: { id } })
	}

	async deleteTask(id: string) {
		const task = await this.prisma.task.findUnique({
			where: { id },
		})

		if (!task) throw new NotFoundException('Task not found')

		const lesson = await this.prisma.lesson.findUnique({
			where: { id: task.lessonId },
			include: {
				blocks: true,
				tasks: true,
			},
		})

		// Удаляем задачу
		await this.prisma.task.delete({
			where: { id },
		})

		// Пересчитываем время урока после удаления задачи
		if (lesson) {
			const newEstimatedDuration = this.calculateEstimatedDuration(
				lesson.blocks.length,
				lesson.tasks.length - 1 // -1 удаленная задача
			)

			await this.prisma.lesson.update({
				where: { id: task.lessonId },
				data: {
					estimatedDuration: newEstimatedDuration,
				},
			})
		}
	}

	async deleteTest(id: string) {
		return this.prisma.test.delete({ where: { id } })
	}

	async deleteTestQuestion(id: string) {
		return this.prisma.testQuestion.delete({ where: { id } })
	}

	/**
	 * Рассчитывает примерное время прохождения урока
	 * @param blocksCount - количество теоретических блоков
	 * @param tasksCount - количество практических заданий
	 * @returns время в минутах
	 */
	private calculateEstimatedDuration(
		blocksCount: number,
		tasksCount: number
	): number {
		const BASE_TIME = 2 // базовое время на урок
		const TIME_PER_BLOCK = 2 // 2 минуты на блок теории
		const TIME_PER_TASK = 5 // 5 минут на задачу

		return BASE_TIME + blocksCount * TIME_PER_BLOCK + tasksCount * TIME_PER_TASK
	}
}
