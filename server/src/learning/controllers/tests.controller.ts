import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { TProtectUserData } from 'src/types/auth.types'
import { SubmitTestDto } from '../dto/submit-test.dto'
import { TestsService } from '../services/tests.service'

@Controller('learning/tests')
@Auth()
export class TestsController {
	constructor(private readonly testsService: TestsService) {}
	@Get()
	async getTests() {
		return this.testsService.getTests()
	}
	@Get(':id')
	async getTest(@Param('id') id: string) {
		return this.testsService.getTestById(id)
	}
	@Post(':id/submit')
	async submitTest(
		@Param('id') id: string,
		@Body() dto: SubmitTestDto,
		@CurrentUser() user: TProtectUserData
	) {
		return this.testsService.submitTest(id, user.id, dto)
	}
}
