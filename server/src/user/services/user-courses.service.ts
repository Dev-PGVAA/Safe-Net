import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { UserCourseDto } from '../dto/user-course.dto'
@Injectable()
export class UserCoursesService {
	constructor(private readonly prisma: PrismaService) {}
	async getMyCourses(userId: string): Promise<UserCourseDto[]> {
		const progresses = await this.prisma.courseProgress.findMany({
			where: { userId },
			include: {
				course: {
					select: {
						id: true,
						slug: true,
						title: true,
						description: true
					}
				}
			},
			orderBy: { updatedAt: 'desc' }
		})
		return progresses.map(p => ({
			id: p.course.id,
			slug: p.course.slug,
			title: p.course.title,
			description: p.course.description,
			progress: p.progress,
			totalXp: p.totalXp,
			completed: p.progress === 100
		}))
	}
	async getMyCompletedCourses(userId: string): Promise<UserCourseDto[]> {
		const progresses = await this.prisma.courseProgress.findMany({
			where: { userId, progress: 100 },
			include: {
				course: {
					select: {
						id: true,
						slug: true,
						title: true,
						description: true
					}
				}
			},
			orderBy: { updatedAt: 'desc' }
		})
		return progresses.map(p => ({
			id: p.course.id,
			slug: p.course.slug,
			title: p.course.title,
			description: p.course.description,
			progress: p.progress,
			totalXp: p.totalXp,
			completed: true
		}))
	}
}
