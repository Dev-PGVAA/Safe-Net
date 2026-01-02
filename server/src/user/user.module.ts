import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { UserCertificatesController } from './controllers/user-certificates.controller'
import { UserCoursesController } from './controllers/user-courses.controller'
import { UserController } from './controllers/user.controller'
import { UserCertificatesService } from './services/user-certificates.service'
import { UserCoursesService } from './services/user-courses.service'
import { UserService } from './services/user.service'
@Module({
	controllers: [
		UserController,
		UserCertificatesController,
		UserCoursesController,
	],
	providers: [
		UserService,
		UserCertificatesService,
		UserCoursesService,
		PrismaService,
	],
	exports: [UserService],
})
export class UserModule {}
