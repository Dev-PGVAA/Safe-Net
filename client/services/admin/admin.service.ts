import { instance } from '@/api/axios'
import {
    CreateBlockDto,
    CreateCourseDto,
    CreateLessonDto,
    CreateStageDto,
    CreateTaskDto,
    CreateTestDto,
    CreateTestQuestionDto,
    IAdminStats,
    IBlock,
    ICourse,
    ILesson,
    IStageWithCourses,
    ITask,
    ITest,
    ITestQuestion,
    IUserDetail,
    IUserListItem,
    UpdateUserDto,
} from '@/services/admin/admin.types'

class AdminService {
	// ============================================
	// STATS
	// ============================================

	async getStats() {
		return (await instance.get('/admin/stats/overview')).data as IAdminStats
	}

	// ============================================
	// STAGES
	// ============================================

	async getStages() {
		return (await instance.get('/admin/learning/stages'))
			.data as IStageWithCourses[]
	}

	async createStage(data: CreateStageDto) {
		return (await instance.post('/admin/learning/stages', data))
			.data as IStageWithCourses
	}

	async updateStage(stageId: string, data: Partial<CreateStageDto>) {
		return (await instance.put(`/admin/learning/stages/${stageId}`, data)).data
	}

	async deleteStage(stageId: string) {
		return (await instance.delete(`/admin/learning/stages/${stageId}`)).data
	}

	// ============================================
	// COURSES
	// ============================================

	async getCoursesList() {
		return (await instance.get('/admin/learning/courses/list'))
			.data as ICourse[]
	}

	async getCourse(courseId: string) {
		return (await instance.get(`/admin/learning/courses/${courseId}`))
			.data as ICourse
	}

	async getCoursesAnalytics() {
		return (await instance.get('/admin/learning/courses/analytics')).data
	}

	async createCourse(data: CreateCourseDto) {
		return (await instance.post('/admin/learning/courses', data))
			.data as ICourse
	}

	async updateCourse(courseId: string, data: Partial<CreateCourseDto>) {
		return (await instance.put(`/admin/learning/courses/${courseId}`, data))
			.data
	}

	async deleteCourse(courseId: string) {
		return (await instance.delete(`/admin/learning/courses/${courseId}`)).data
	}

	// ============================================
	// LESSONS
	// ============================================

	async getLesson(lessonId: string) {
		return (await instance.get(`/admin/learning/lessons/${lessonId}`))
			.data as ILesson
	}

	async getLessonsList(courseId: string) {
		return (await instance.get(`/admin/learning/courses/${courseId}/lessons`))
			.data as ILesson[]
	}

	async createLesson(data: CreateLessonDto) {
		return (await instance.post('/admin/learning/lessons', data))
			.data as ILesson
	}

	async updateLesson(lessonId: string, data: Partial<CreateLessonDto>) {
		return (await instance.put(`/admin/learning/lessons/${lessonId}`, data))
			.data
	}

	async deleteLesson(lessonId: string) {
		return (await instance.delete(`/admin/learning/lessons/${lessonId}`)).data
	}

	// ============================================
	// BLOCKS
	// ============================================

	async getBlocks(lessonId: string) {
		return (await instance.get(`/learning/lessons/${lessonId}/blocks`))
			.data as IBlock[]
	}

	async createBlock(data: CreateBlockDto) {
	  return (await instance.post('/admin/learning/blocks', data)).data as IBlock
	}

	async updateBlock(blockId: string, data: Partial<CreateBlockDto>) {
	  return (await instance.patch(`/admin/learning/blocks/${blockId}`, data)).data
	}

	async deleteBlock(blockId: string) {
	  return (await instance.delete(`/admin/learning/blocks/${blockId}`)).data
	}

	// ============================================
	// TASKS
	// ============================================

	async getTasks(lessonId: string) {
		return (await instance.get(`/admin/learning/lessons/${lessonId}/tasks`))
			.data as ITask[]
	}

	async createTask(data: CreateTaskDto) {
		return (await instance.post('/admin/learning/tasks', data)).data as ITask
	}

	async updateTask(taskId: string, data: Partial<CreateTaskDto>) {
		return (await instance.put(`/admin/learning/tasks/${taskId}`, data)).data
	}

	async deleteTask(taskId: string) {
		return (await instance.delete(`/admin/learning/tasks/${taskId}`)).data
	}

	// ============================================
	// TESTS
	// ============================================

	async getTests() {
		return (await instance.get('/admin/learning/tests')).data as ITest[]
	}

	async getTest(testId: string) {
		return (await instance.get(`/admin/learning/tests/${testId}`)).data as ITest
	}

	async createTest(data: CreateTestDto) {
		return (await instance.post('/admin/learning/tests', data)).data as ITest
	}

	async updateTest(testId: string, data: Partial<CreateTestDto>) {
		return (await instance.put(`/admin/learning/tests/${testId}`, data)).data
	}

	async deleteTest(testId: string) {
		return (await instance.delete(`/admin/learning/tests/${testId}`)).data
	}

	// ============================================
	// TEST QUESTIONS
	// ============================================

	async getTestQuestions(testId: string) {
		return (await instance.get(`/admin/learning/tests/${testId}/questions`))
			.data as ITestQuestion[]
	}

	async createTestQuestion(data: CreateTestQuestionDto) {
		return (await instance.post('/admin/learning/tests/questions', data))
			.data as ITestQuestion
	}

	async updateTestQuestion(
		questionId: string,
		data: Partial<CreateTestQuestionDto>
	) {
		return (
			await instance.put(`/admin/learning/tests/questions/${questionId}`, data)
		).data
	}

	async deleteTestQuestion(questionId: string) {
		return (
			await instance.delete(`/admin/learning/tests/questions/${questionId}`)
		).data
	}

	// ============================================
	// USERS
	// ============================================

	async getUsers(options?: { page?: number; limit?: number; search?: string }) {
		const params = new URLSearchParams()
		if (options?.page) params.append('page', options.page.toString())
		if (options?.limit) params.append('limit', options.limit.toString())
		if (options?.search) params.append('search', options.search)

		return (await instance.get(`/admin/users?${params.toString()}`))
			.data as IUserListItem[]
	}

	async getUserDetail(userId: string) {
		return (await instance.get(`/admin/users/${userId}`)).data as IUserDetail
	}

	async updateUser(userId: string, data: UpdateUserDto) {
		return (await instance.put(`/admin/users/${userId}`, data)).data
	}

	async deleteUser(userId: string) {
		return (await instance.delete(`/admin/users/${userId}`)).data
	}

	// ============================================
	// AUTH
	// ============================================

	async logout() {
		return (await instance.post('/auth/logout')).data
	}

	async getProfile() {
		return (await instance.get('/auth/profile')).data
	}
}

export const adminService = new AdminService()
