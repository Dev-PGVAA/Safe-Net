export class UserAchievementDto {
	id: string
	earnedAt: string
	achievement: {
		id: string
		code: string
		title: string
		description: string
		icon: string
	}
}
