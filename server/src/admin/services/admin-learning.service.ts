import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateBlockDto } from '../dto/create-block.dto'
import { CreateCourseDto } from '../dto/create-course.dto'
import { CreateLessonDto } from '../dto/create-lesson.dto'
import { CreateStageDto } from '../dto/create-stage.dto'
import { CreateTaskDto } from '../dto/create-task.dto'
import { CreateTestDto } from '../dto/create-test.dto'

@Injectable()
export class AdminLearningService {
	constructor(private prisma: PrismaService) {}

	// ==================== COURSES ====================
	async getCoursesList() {
		return this.prisma.course.findMany({
			select: {
				id: true,
				title: true,
				slug: true,
				description: true,
				difficulty: true,
				stageId: true,
			},
			orderBy: { createdAt: 'desc' },
		})
	}

	async getCourse(id: string) {
		return this.prisma.course.findUnique({
			where: { id },
			include: {
				stage: true,
				lessons: {
					include: {
						blocks: {
							orderBy: { order: 'asc' },
						},
						tasks: {
							orderBy: { order: 'asc' },
						},
					},
					orderBy: { order: 'asc' },
				},
				tests: true,
			},
		})
	}

	async createCourse(dto: CreateCourseDto) {
		const { stageId, ...data } = dto
		return this.prisma.$transaction(async (tx) => {
			const course = await tx.course.create({
				data: {
					...data,
					stage: { connect: { id: stageId } },
				},
			})
			const users = await tx.user.findMany({
				select: { id: true },
			})
			if (users.length > 0) {
				await tx.courseProgress.createMany({
					data: users.map((u) => ({
						userId: u.id,
						courseId: course.id,
						progress: 0,
						totalXp: 0,
					})),
					skipDuplicates: true,
				})
			}

			return course
		})
	}

	async updateCourse(id: string, dto: any) {
		return this.prisma.course.update({
			where: { id },
			data: dto,
		})
	}

	async deleteCourse(id: string) {
		return this.prisma.course.delete({
			where: { id },
		})
	}

	// ==================== LESSONS ====================
	async getLesson(id: string) {
		return this.prisma.lesson.findUnique({
			where: { id },
			include: {
				course: true,
				blocks: {
					orderBy: { order: 'asc' },
				},
				tasks: {
					include: {
						options: {
							orderBy: { order: 'asc' },
						},
					},
					orderBy: { order: 'asc' },
				},
			},
		})
	}

	async createLesson(dto: CreateLessonDto) {
		return this.prisma.lesson.create({
			data: dto,
		})
	}

	async updateLesson(id: string, dto: any) {
		return this.prisma.lesson.update({
			where: { id },
			data: dto,
		})
	}

	async deleteLesson(id: string) {
		return this.prisma.lesson.delete({
			where: { id },
		})
	}

	// ==================== BLOCKS ====================
	async createBlock(dto: CreateBlockDto) {
		return this.prisma.lessonBlock.create({
			data: dto,
		})
	}

	async updateBlock(id: string, dto: Partial<CreateBlockDto>) {
		return this.prisma.lessonBlock.update({
			where: { id },
			data: dto,
		})
	}

	async deleteBlock(id: string) {
		return this.prisma.lessonBlock.delete({
			where: { id },
		})
	}

	// ==================== TASKS ====================
	async createTask(dto: CreateTaskDto) {
		const { options, ...taskData } = dto

		// If there are options, add order to each
		const formattedOptions = options?.map((option, index) => ({
			text: option.text,
			isCorrect: option.isCorrect || false,
			order: index + 1, // ✅ Add order
		}))

		return this.prisma.task.create({
			data: {
				...taskData,
				...(formattedOptions && {
					options: {
						createMany: {
							data: formattedOptions,
						},
					},
				}),
			},
			include: {
				options: {
					orderBy: { order: 'asc' },
				},
			},
		})
	}

	async updateTask(id: string, dto: any) {
		const { options, ...taskData } = dto

		// Remove old options
		await this.prisma.taskOption.deleteMany({
			where: { taskId: id },
		})

		// If there are new options, add order
		const formattedOptions = options?.map((option: any, index: number) => ({
			text: option.text,
			isCorrect: option.isCorrect || false,
			order: index + 1, // ✅ Add order
		}))

		return this.prisma.task.update({
			where: { id },
			data: {
				...taskData,
				...(formattedOptions && {
					options: {
						createMany: {
							data: formattedOptions,
						},
					},
				}),
			},
			include: {
				options: {
					orderBy: { order: 'asc' },
				},
			},
		})
	}

	async deleteTask(id: string) {
		return this.prisma.task.delete({
			where: { id },
		})
	}

	// ==================== TESTS ====================
	async getTests() {
		return this.prisma.test.findMany({
			include: {
				course: {
					select: {
						title: true,
					},
				},
				questions: {
					orderBy: { order: 'asc' },
				},
			},
			orderBy: { createdAt: 'desc' },
		})
	}

	async getTest(id: string) {
		return this.prisma.test.findUnique({
			where: { id },
			include: {
				course: true,
				questions: {
					include: {
						options: {
							orderBy: { order: 'asc' },
						},
					},
					orderBy: { order: 'asc' },
				},
			},
		})
	}

	async createTest(dto: CreateTestDto) {
		return this.prisma.test.create({
			data: dto,
		})
	}

	async updateTest(id: string, dto: any) {
		return this.prisma.test.update({
			where: { id },
			data: dto,
		})
	}

	async deleteTest(id: string) {
		return this.prisma.test.delete({
			where: { id },
		})
	}

	// ==================== TEST QUESTIONS ====================
	async createTestQuestion(dto: any) {
		const { options, ...questionData } = dto

		// If there are options, add order to each
		const formattedOptions = options?.map((option: any, index: number) => ({
			text: option.text,
			isCorrect: option.isCorrect || false,
			order: index + 1, // ✅ Add order
		}))

		return this.prisma.testQuestion.create({
			data: {
				...questionData,
				...(formattedOptions && {
					options: {
						createMany: {
							data: formattedOptions,
						},
					},
				}),
			},
			include: {
				options: {
					orderBy: { order: 'asc' },
				},
			},
		})
	}

	async updateTestQuestion(id: string, dto: any) {
		const { options, ...questionData } = dto

		// Remove old options
		await this.prisma.testQuestionOption.deleteMany({
			where: { testQuestionId: id },
		})

		// Add order to new options
		const formattedOptions = options?.map((option: any, index: number) => ({
			text: option.text,
			isCorrect: option.isCorrect || false,
			order: index + 1, // ✅ Add order
		}))

		return this.prisma.testQuestion.update({
			where: { id },
			data: {
				...questionData,
				...(formattedOptions && {
					options: {
						createMany: {
							data: formattedOptions,
						},
					},
				}),
			},
			include: {
				options: {
					orderBy: { order: 'asc' },
				},
			},
		})
	}

	async deleteTestQuestion(id: string) {
		return this.prisma.testQuestion.delete({
			where: { id },
		})
	}

	// ==================== STAGES ====================
	async getStages() {
		return this.prisma.stage.findMany({
			include: {
				courses: {
					select: {
						id: true,
						title: true,
						slug: true,
						description: true,
						difficulty: true,
					},
					orderBy: { createdAt: 'asc' },
				},
			},
			orderBy: { order: 'asc' },
		})
	}

	async getStage(id: string) {
		return this.prisma.stage.findUnique({
			where: { id },
			include: {
				courses: {
					include: {
						_count: {
							select: {
								lessons: true,
								progress: true,
							},
						},
					},
					orderBy: { createdAt: 'asc' },
				},
			},
		})
	}

	async createStage(dto: CreateStageDto) {
		return this.prisma.stage.create({
			data: dto,
			include: {
				courses: true,
			},
		})
	}

	async updateStage(id: string, dto: Partial<CreateStageDto>) {
		return this.prisma.stage.update({
			where: { id },
			data: dto,
			include: {
				courses: true,
			},
		})
	}

	async deleteStage(id: string) {
		return this.prisma.stage.delete({
			where: { id },
		})
	}
}
