import { createTokens, setRefreshTokenCookie } from '@/lib/auth/tokens'
import { prisma } from '@/lib/prisma'
import { verify } from 'argon2'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
	try {
		const { email, password } = await request.json()

		const user = await prisma.user.findUnique({
			where: { email },
			select: { id: true, email: true, name: true, password: true },
		})

		if (!user) {
			return NextResponse.json(
				{ error: 'Пользователь не найден' },
				{ status: 404 }
			)
		}

		const isValid = await verify(user.password, password)
		if (!isValid) {
			return NextResponse.json({ error: 'Неверный пароль' }, { status: 401 })
		}

		const { accessToken, refreshToken } = createTokens(user.id)

		const response = NextResponse.json({
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
			},
			accessToken,
		})

		setRefreshTokenCookie(response, refreshToken)

		return response
	} catch (error) {
		console.error('Login error:', error)
		return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
	}
}
