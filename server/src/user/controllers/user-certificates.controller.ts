import { Controller, Get } from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { TProtectUserData } from 'src/types/auth.types'
import { UserCertificatesService } from '../services/user-certificates.service'
@Controller('user/certificates')
@Auth()
export class UserCertificatesController {
	constructor(
		private readonly userCertificatesService: UserCertificatesService
	) {}
	@Get()
	async getMyCertificates(@CurrentUser() user: TProtectUserData) {
		return this.userCertificatesService.getMyCertificates(user.id)
	}
}
