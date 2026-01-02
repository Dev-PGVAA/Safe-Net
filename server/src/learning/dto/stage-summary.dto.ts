export class StageSummaryDto {
	id: string
	slug: string
	order: number
	title: string
	subtitle?: string | null
	icon?: string | null
	coursesCount: number
	totalLessons: number
}
