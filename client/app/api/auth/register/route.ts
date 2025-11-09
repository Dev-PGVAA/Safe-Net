import { createTokens, setRefreshTokenCookie } from '@/lib/auth/tokens'
import { prisma } from '@/lib/prisma'
import { hash } from 'argon2'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
	try {
		const { name, email, password } = await request.json()

		const existingUser = await prisma.user.findUnique({
			where: { email },
		})

		if (existingUser) {
			return NextResponse.json(
				{ error: 'Пользователь с таким email уже существует' },
				{ status: 409 }
			)
		}

		const hashedPassword = await hash(password)

		const user = await prisma.user.create({
			data: {
				email,
				name,
				password: hashedPassword,
			},
			select: {
				id: true,
				email: true,
				name: true,
			},
		})

		const { accessToken, refreshToken } = createTokens(user.id)

		const response = NextResponse.json({
			user,
			accessToken,
		})

		setRefreshTokenCookie(response, refreshToken)

		return response
	} catch (error) {
		console.error('Registration error:', error)
		return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
	}
}
