import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class CertificatesService {
	constructor(private readonly prisma: PrismaService) {}

	async getCertificateById(id: string, userId: string, userRights?: string[]) {
		const certificate = await this.prisma.certificate.findUnique({
			where: { id },
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
				course: {
					select: {
						id: true,
						title: true,
						description: true,
						difficulty: true,
					},
				},
			},
		})

		if (!certificate) {
			throw new NotFoundException('Certificate not found')
		}

		// Check whether the user has admin rights
		const isAdmin =
			userRights?.includes('ADMIN') || userRights?.includes('admin')

		if (!isAdmin && certificate.userId !== userId) {
			throw new ForbiddenException('You do not have access to this certificate')
		}

		return {
			id: certificate.id,
			certificateNumber: certificate.certificateNumber,
			userId: certificate.userId,
			courseId: certificate.courseId,
			issuedAt: certificate.issuedAt.toISOString(),
			user: certificate.user,
			course: certificate.course,
		}
	}

	async getUserCertificates(userId: string) {
		const certificates = await this.prisma.certificate.findMany({
			where: { userId },
			include: {
				course: {
					select: {
						id: true,
						title: true,
						slug: true,
					},
				},
			},
			orderBy: {
				issuedAt: 'desc',
			},
		})

		return certificates.map(cert => ({
			id: cert.id,
			certificateNumber: cert.certificateNumber,
			courseId: cert.courseId,
			courseTitle: cert.course.title,
			courseSlug: cert.course.slug,
			issuedAt: cert.issuedAt.toISOString(),
		}))
	}
}
