import { Controller, Get } from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { TProtectUserData } from 'src/types/auth.types'
import { UserCoursesService } from '../services/user-courses.service'
@Controller('user/courses')
@Auth()
export class UserCoursesController {
	constructor(private readonly userCoursesService: UserCoursesService) {}
	@Get()
	async getMyCourses(@CurrentUser() user: TProtectUserData) {
		return this.userCoursesService.getMyCourses(user.id)
	}
	@Get('completed')
	async getMyCompletedCourses(@CurrentUser() user: TProtectUserData) {
		return this.userCoursesService.getMyCompletedCourses(user.id)
	}
}
