import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { UserCertificateDto } from '../dto/user-certificate.dto'
@Injectable()
export class UserCertificatesService {
	constructor(private readonly prisma: PrismaService) {}
	async getMyCertificates(userId: string): Promise<UserCertificateDto[]> {
		const certificates = await this.prisma.certificate.findMany({
			where: { userId },
			include: {
				course: {
					select: {
						id: true,
						title: true
					}
				}
			},
			orderBy: { issuedAt: 'desc' }
		})
		return certificates.map(c => ({
			id: c.id,
			courseId: c.course.id,
			courseTitle: c.course.title,
			issuedAt: c.issuedAt,
			certificateNumber: c.certificateNumber
		}))
	}
}
