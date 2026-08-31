import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { createHash, randomBytes } from 'crypto'
import { normalizeEmail } from 'src/common/email'
import { PrismaService } from 'src/prisma.service'
import { PasswordResetMailer } from './password-reset-mailer.service'

const TOKEN_BYTES = 32
const EXPIRY_MINUTES = 30

@Injectable()
export class EmailVerificationService {
	private readonly logger = new Logger(EmailVerificationService.name)

	constructor(
		private readonly prisma: PrismaService,
		private readonly mailer: PasswordResetMailer
	) {}

	private hashToken(token: string) {
		return createHash('sha256').update(token).digest('hex')
	}

	async sendForUser(user: { id: string; email: string; legalLocale?: string | null }) {
		const token = randomBytes(TOKEN_BYTES).toString('hex')
		const expiresAt = new Date(Date.now() + EXPIRY_MINUTES * 60_000)
		await this.prisma.$transaction(async tx => {
			await tx.emailVerificationToken.updateMany({
				where: { userId: user.id, usedAt: null },
				data: { usedAt: new Date() },
			})
			await tx.emailVerificationToken.create({
				data: { userId: user.id, tokenHash: this.hashToken(token), expiresAt },
			})
		})

		const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000'
		const link = `${frontendUrl}/?auth=verify&token=${token}`
		try {
			await this.mailer.sendVerificationLink(
				user.email,
				link,
				user.legalLocale === 'ru' ? 'ru' : 'en'
			)
		} catch {
			// Do not log recipients or links: both are sensitive operational data.
			this.logger.error('Email verification delivery failed')
		}
	}

	async resend(email: string) {
		const user = await this.prisma.user.findUnique({
			where: { email: normalizeEmail(email) },
			select: { id: true, email: true, legalLocale: true, emailVerifiedAt: true },
		})
		if (user && !user.emailVerifiedAt) await this.sendForUser(user)
		return { message: 'If an unverified account exists for that email, a link has been sent.' }
	}

	async verify(token: string) {
		const now = new Date()
		const updated = await this.prisma.$transaction(async tx => {
			const consumed = await tx.emailVerificationToken.updateMany({
				where: { tokenHash: this.hashToken(token), usedAt: null, expiresAt: { gt: now } },
				data: { usedAt: now },
			})
			if (consumed.count !== 1) return null
			const record = await tx.emailVerificationToken.findUnique({
				where: { tokenHash: this.hashToken(token) },
				select: { userId: true },
			})
			if (!record) return null
			return tx.user.update({ where: { id: record.userId }, data: { emailVerifiedAt: now } })
		})
		if (!updated) throw new BadRequestException('Invalid or expired verification link')
		return { message: 'Email verified.', userId: updated.id }
	}
}
