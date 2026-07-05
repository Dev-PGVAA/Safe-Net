import {
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserStatus } from '@prisma/client'
import { verify } from 'argon2'
import { Response } from 'express'
import { AchievementsService } from 'src/learning/services/achievements.service'
import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/services/user.service'
import { AuthLoginDto, AuthRegisterDto } from './dto/auth.dto'
@Injectable()
export class AuthService {
	EXPIRE_DAY_REFRESH_TOKEN = 1
	REFRESH_TOKEN_NAME = 'refresh_token'
	constructor(
		private jwt: JwtService,
		private UserService: UserService,
		private AchievementsService: AchievementsService,
		private prisma: PrismaService
	) {}
	async login(dto: AuthLoginDto) {
		const { password, ...user } = await this.validateUser(dto)
		const tokens = this.issueTokens(user.id)
		return {
			user,
			...tokens,
		}
	}
	async register(dto: AuthRegisterDto) {
		const oldUserEmail = await this.UserService.getByEmail(dto.email)
		if (oldUserEmail)
			throw new UnauthorizedException(
				'A user with this email already exists'
			)

		const { password, ...user } = await this.UserService.create(dto)
		const tokens = this.issueTokens(user.id)

		await this.AchievementsService.awardAchievement(user.id, 'FIRST_LOGIN')

		return {
			user,
			...tokens,
		}
	}
	async newPassword(dto: AuthLoginDto) {
		const user = await this.UserService.getByEmail(dto.email)
		if (!user) throw new NotFoundException('User not found')
		await this.UserService.update(user.id, { password: dto.password })
		return { message: 'Password has been changed' }
	}
	private issueTokens(userId: string) {
		const data = { id: userId }
		const accessToken = this.jwt.sign(data, {
			expiresIn: '1h',
		})
		const refreshToken = this.jwt.sign(data, {
			expiresIn: '7d',
		})
		return {
			accessToken,
			refreshToken,
		}
	}
	private async validateUser(dto: AuthLoginDto) {
		const user = await this.UserService.getByEmail(dto.email)
		if (!user) throw new NotFoundException('User not found')
		const isValid = await verify(user.password, dto.password)
		if (!isValid) throw new UnauthorizedException('Incorrect password')
		if (user.status === UserStatus.BLOCKED)
			throw new UnauthorizedException('User is blocked')
		return user
	}
	addRefreshTokenToResponse(res: Response, refreshToken: string) {
		const expiresIn = new Date()
		expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)

		res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
			httpOnly: true,
			expires: expiresIn,
			secure: false, // ← use process.env.NODE_ENV === 'production' for production
			sameSite: 'lax', // ← 'lax' or 'strict' for local development
		})
	}

	async getNewTokens(refreshToken: string) {
		const result = await this.jwt.verifyAsync(refreshToken)
		if (!result)
			throw new UnauthorizedException('Invalid refresh token')
		const { password, ...user } = await this.UserService.getById(result.id)
		const tokens = this.issueTokens(user.id)
		return {
			user,
			...tokens,
		}
	}
	removeRefreshTokenFromResponse(res: Response) {
		res.cookie(this.REFRESH_TOKEN_NAME, '', {
			httpOnly: true,
			expires: new Date(0),
			secure: false,
			sameSite: 'lax',
		})
	}
}
