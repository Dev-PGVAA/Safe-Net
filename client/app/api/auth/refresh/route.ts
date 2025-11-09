import {
	createTokens,
	setRefreshTokenCookie,
	verifyToken,
} from '@/lib/auth/tokens'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url)
	const redirect = searchParams.get('redirect') || '/dashboard'

	const refreshToken = request.cookies.get('refresh_token')?.value

	if (!refreshToken) {
		return NextResponse.redirect(new URL('/login', request.url), 307)
	}

	try {
		const decoded = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET!)

		if (!decoded) {
			return NextResponse.redirect(new URL('/login', request.url), 307)
		}

		const user = await prisma.user.findUnique({
			where: { id: decoded.id },
			select: { id: true, email: true, name: true },
		})

		if (!user) {
			return NextResponse.redirect(new URL('/login', request.url), 307)
		}

		const { accessToken, refreshToken: newRefreshToken } = createTokens(user.id)

		const response = NextResponse.redirect(new URL(redirect, request.url), 307)

		// Устанавливаем новые токены
		response.cookies.set('access_token', accessToken, {
			httpOnly: false,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			path: '/',
			maxAge: 3600, // 1 hour
		})

		setRefreshTokenCookie(response, newRefreshToken)

		return response
	} catch (error) {
		console.error('Token refresh error:', error)
		return NextResponse.redirect(new URL('/login', request.url), 307)
	}
}
