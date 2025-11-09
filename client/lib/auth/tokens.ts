import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

export const REFRESH_TOKEN_NAME = 'refresh_token'

export const createTokens = (userId: string) => {
	const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
		expiresIn: '1h',
	})

	const refreshToken = jwt.sign(
		{ id: userId },
		process.env.REFRESH_TOKEN_SECRET!,
		{ expiresIn: '7d' }
	)

	return { accessToken, refreshToken }
}

export const verifyToken = (token: string, secret: string) => {
	try {
		return jwt.verify(token, secret) as { id: string }
	} catch (error) {
		return null
	}
}

export const setRefreshTokenCookie = (
	res: NextResponse,
	refreshToken: string
) => {
	const expires = new Date()
	expires.setDate(expires.getDate() + 7) // 7 дней

	res.cookies.set(REFRESH_TOKEN_NAME, refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		path: '/',
		expires,
	})
}

export const clearRefreshTokenCookie = (res: NextResponse) => {
	res.cookies.set(REFRESH_TOKEN_NAME, '', {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		path: '/',
		maxAge: 0,
	})
}
