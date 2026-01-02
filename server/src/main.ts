import { AppModule } from './app.module'
import { NestFactory } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'
import * as fs from 'fs'

async function bootstrap() {
	const httpsOptions = {
		key: fs.readFileSync('./src/certificates/key.pem'),
		cert: fs.readFileSync('./src/certificates/cert.pem')
	}
	const app = await NestFactory.create(AppModule)
	app.setGlobalPrefix('api')
	app.use(cookieParser())
	app.enableCors({
		origin: [process.env.FRONTEND_URL],
		credentials: true,
		exposedHeaders: 'set-cookie'
	})
	await app.listen(4200)
}
bootstrap()
