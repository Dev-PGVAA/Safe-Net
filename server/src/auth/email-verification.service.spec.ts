import { BadRequestException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { PasswordResetMailer } from './password-reset-mailer.service'
import { EmailVerificationService } from './email-verification.service'

describe('EmailVerificationService', () => {
	it('consumes a verification token exactly once under concurrent requests', async () => {
		let consumed = false
		const token = 'a'.repeat(64)
		const prisma = {
			$transaction: jest.fn(async callback =>
				callback({
					emailVerificationToken: {
						updateMany: jest.fn(async () => {
							if (consumed) return { count: 0 }
							consumed = true
							return { count: 1 }
						}),
						findUnique: jest.fn().mockResolvedValue({ userId: 'user-1' }),
					},
					user: { update: jest.fn().mockResolvedValue({ id: 'user-1' }) },
				})
			),
		}
		const service = new EmailVerificationService(
			prisma as unknown as PrismaService,
			{} as PasswordResetMailer
		)

		const results = await Promise.allSettled(
			Array.from({ length: 100 }, () => service.verify(token))
		)

		expect(results.filter(result => result.status === 'fulfilled')).toHaveLength(1)
		expect(results.filter(result => result.status === 'rejected')).toHaveLength(99)
		for (const result of results) {
			if (result.status === 'rejected') {
				expect(result.reason).toBeInstanceOf(BadRequestException)
			}
		}
	})
})
