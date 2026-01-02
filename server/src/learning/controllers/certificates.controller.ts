import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard'
import { CertificatesService } from '../services/certificates.service'

@Controller('learning/certificates')
@UseGuards(JwtAuthGuard)
export class CertificatesController {
	constructor(private readonly certificatesService: CertificatesService) {}

	@Get(':id')
	async getCertificate(
		@Param('id') id: string,
		@CurrentUser('id') userId: string
	) {
		return this.certificatesService.getCertificateById(id, userId)
	}

	@Get()
	async getUserCertificates(@CurrentUser('id') userId: string) {
		return this.certificatesService.getUserCertificates(userId)
	}
}
