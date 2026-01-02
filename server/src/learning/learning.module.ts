import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { CertificatesController } from './controllers/certificates.controller'
import { CoursesController } from './controllers/courses.controller'
import { ProgressController } from './controllers/progress.controller'
import { StagesController } from './controllers/stages.controller'
import { TestsController } from './controllers/tests.controller'
import { CertificatesService } from './services/certificates.service'
import { CoursesService } from './services/courses.service'
import { ProgressService } from './services/progress.service'
import { StagesService } from './services/stages.service'
import { TestsService } from './services/tests.service'

@Module({
	controllers: [
		StagesController,
		CoursesController,
		TestsController,
		ProgressController,
		CertificatesController,
	],
	providers: [
		PrismaService,
		StagesService,
		CoursesService,
		TestsService,
		ProgressService,
		CertificatesService,
	],
	exports: [StagesService, CoursesService, ProgressService],
})
export class LearningModule {}
