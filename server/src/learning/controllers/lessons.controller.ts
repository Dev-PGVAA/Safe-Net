import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from '@nestjs/common'
import { Role } from '@prisma/client'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { Roles } from 'src/auth/decorators/roles.decorator'
import { CreateLessonBlockDto } from '../dto/create-lesson-block.dto'
import { UpdateLessonBlockDto } from '../dto/update-lesson-block.dto'
import { LessonsService } from '../services/lessons.service'

@Auth()
@Controller('learning/lessons')
export class LessonsController {
	constructor(private readonly lessonsService: LessonsService) {}

	@Get(':id')
	async getLessonDetails(@Param('id') id: string) {
		return this.lessonsService.getLessonDetails(id)
	}

	@Get(':id/blocks')
	async getBlocks(@Param('id') lessonId: string) {
		return this.lessonsService.getBlocksByLesson(lessonId)
	}

	@Post('blocks')
	@Roles(Role.ADMIN)
	async createBlock(@Body() dto: CreateLessonBlockDto) {
		return this.lessonsService.createBlock(dto)
	}

	@Patch('blocks/:id')
	@Roles(Role.ADMIN)
	async updateBlock(
		@Param('id') id: string,
		@Body() dto: UpdateLessonBlockDto
	) {
		return this.lessonsService.updateBlock(id, dto)
	}

	@Delete('blocks/:id')
	@Roles(Role.ADMIN)
	async deleteBlock(@Param('id') id: string) {
		await this.lessonsService.deleteBlock(id)
		return { message: 'Block deleted successfully' }
	}
}
