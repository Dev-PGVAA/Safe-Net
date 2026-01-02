import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'
import { StageSummaryDto } from '../dto/stage-summary.dto'
@Injectable()
export class StagesService {
	constructor(private readonly prisma: PrismaService) {}
	async getStagesWithStats(): Promise<StageSummaryDto[]> {
		const stages = await this.prisma.stage.findMany({
			orderBy: { order: 'asc' },
			include: {
				courses: {
					include: {
						lessons: {
							select: { id: true }
						}
					}
				}
			}
		})
		return stages.map(stage => ({
			id: stage.id,
			slug: stage.slug,
			order: stage.order,
			title: stage.title,
			subtitle: stage.subtitle,
			icon: stage.icon,
			coursesCount: stage.courses.length,
			totalLessons: stage.courses.reduce((sum, c) => sum + c.lessons.length, 0)
		}))
	}
}
