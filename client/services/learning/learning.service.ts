import { instance } from '@/api/axios'
import {
	ICertificate,
	ICertificateListItem,
	ICourseDetail,
	ILesson,
	IStage,
	ITest,
	ITestResult,
	IUserCourse,
} from './learning.types'

class LearningService {
	async getStages(): Promise<IStage[]> {
		const { data } = await instance.get('/learning/stages')
		return data
	}

	async getMyCourses(): Promise<IUserCourse[]> {
		const { data } = await instance.get('/user/courses')
		return data
	}

	async getUserCourses(): Promise<IUserCourse[]> {
		const { data } = await instance.get('/user/courses')
		return data
	}

	async getCompletedCourses(): Promise<IUserCourse[]> {
		const { data } = await instance.get('/user/courses/completed')
		return data
	}

	async getCourseDetail(slug: string): Promise<ICourseDetail> {
		const { data } = await instance.get(`/learning/courses/${slug}`)
		return data
	}

	async getLessonDetail(id: string): Promise<ILesson> {
		const { data } = await instance.get(`/learning/lessons/${id}`)
		return data
	}

	async answerTask(
		taskId: string,
		payload: { selectedOptionIds: string[] }
	): Promise<{
		taskId: string
		isCorrect: boolean
		awardedXp: number
		totalXp: number
		courseProgress: number
		lessonCompleted: boolean
		certificateIssued: boolean
	}> {
		const { data } = await instance.post(
			`/learning/tasks/${taskId}/answer`,
			payload
		)
		return data
	}

	async getTestDetail(id: string): Promise<ITest> {
		const { data } = await instance.get(`/learning/tests/${id}`)
		return data
	}

	async submitTest(
		testId: string,
		answers: Array<{
			questionId: string
			selectedOptionIds?: string[]
			textAnswer?: string
		}>,
		time: number
	): Promise<ITestResult> {
		const { data } = await instance.post(`/learning/tests/${testId}/submit`, {
			answers,
			time,
		})
		return data
	}

	async getCertificate(id: string): Promise<ICertificate> {
		const { data } = await instance.get(`/learning/certificates/${id}`)
		return data
	}

	async getUserCertificates(): Promise<ICertificateListItem[]> {
		const { data } = await instance.get('/learning/certificates')
		return data
	}
}

export const learningService = new LearningService()
export * from './learning.types'
