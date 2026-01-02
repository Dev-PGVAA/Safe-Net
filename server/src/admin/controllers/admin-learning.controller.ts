import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { Role } from '@prisma/client'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { Roles } from 'src/auth/decorators/roles.decorator'
import { RolesGuard } from 'src/auth/guard/roles.guard'
import { CreateCourseDto } from '../dto/create-course.dto'
import { CreateLessonDto } from '../dto/create-lesson.dto'
import { CreateStageDto } from '../dto/create-stage.dto'
import { CreateTaskDto } from '../dto/create-task.dto'
import { CreateTestQuestionDto } from '../dto/create-test-question.dto'
import { CreateTestDto } from '../dto/create-test.dto'
import { AdminLearningService } from '../services/admin-learning.service'

@Controller('admin/learning')
@Auth()
@Roles(Role.ADMIN)
@UseGuards(RolesGuard)
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class AdminLearningController {
	constructor(private readonly adminLearningService: AdminLearningService) {}
	@Get('stages')
	async getStages() {
		return this.adminLearningService.getStages()
	}
	@Post('stages')
	async createStage(@Body() dto: CreateStageDto) {
		return this.adminLearningService.createStage(dto)
	}
	@Post('courses')
	async createCourse(@Body() dto: CreateCourseDto) {
		return this.adminLearningService.createCourse(dto)
	}
	@Post('lessons')
	async createLesson(@Body() dto: CreateLessonDto) {
		return this.adminLearningService.createLesson(dto)
	}
	@Post('tasks')
	async createTask(@Body() dto: CreateTaskDto) {
		return this.adminLearningService.createTask(dto)
	}
	@Post('tests')
	async createTest(@Body() dto: CreateTestDto) {
		return this.adminLearningService.createTest(dto)
	}
	@Post('tests/questions')
	async createTestQuestion(@Body() dto: CreateTestQuestionDto) {
		return this.adminLearningService.createTestQuestion(dto)
	}
	@Delete('courses/:id')
	async deleteCourse(@Param('id') id: string) {
		return this.adminLearningService.deleteCourse(id)
	}
	@Delete('lessons/:id')
	async deleteLesson(@Param('id') id: string) {
		return this.adminLearningService.deleteLesson(id)
	}
	@Delete('tasks/:id')
	async deleteTask(@Param('id') id: string) {
		return this.adminLearningService.deleteTask(id)
	}
	@Delete('tests/:id')
	async deleteTest(@Param('id') id: string) {
		return this.adminLearningService.deleteTest(id)
	}
	@Delete('tests/questions/:id')
	async deleteTestQuestion(@Param('id') id: string) {
		return this.adminLearningService.deleteTestQuestion(id)
	}
}
