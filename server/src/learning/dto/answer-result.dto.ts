export class AnswerResultDto {
	taskId: string
	isCorrect: boolean
	awardedXp: number
	totalXp: number
	courseProgress: number
	lessonCompleted: boolean
	certificateIssued?: boolean
}
