export class AnswerResultDto {
	taskId: string
	isCorrect: boolean
	explanation?: string
	awardedXp: number
	totalXp: number
	courseProgress: number
	lessonCompleted: boolean
	certificateIssued: boolean
	newAchievements?: string[] // Add this field
}
