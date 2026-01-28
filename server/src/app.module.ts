import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AdminModule } from './admin/admin.module'
import { AuthModule } from './auth/auth.module'
import { LearningModule } from './learning/learning.module'
import { PublicModule } from './public/public.module'
import { UserModule } from './user/user.module'

@Module({
	imports: [
		ConfigModule.forRoot(),
		AuthModule,
		UserModule,
		LearningModule,
		AdminModule,
		PublicModule
	]
})
export class AppModule {}
