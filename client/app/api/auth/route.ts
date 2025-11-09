import {
	clearRefreshTokenCookie,
	createTokens,
	REFRESH_TOKEN_NAME,
	setRefreshTokenCookie,
	verifyToken,
} from '@/lib/auth/tokens'
import { validateLogin, validateRegister } from '@/lib/auth/validation'
import { prisma } from '@/lib/prisma'
import { hash, verify } from 'argon2'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
	const { action, ...data } = await request.json()

	try {
		switch (action) {
			case 'login':
				return await handleLogin(data)
			case 'register':
				return await handleRegister(data)
			case 'refresh':
				return await handleRefresh()
			case 'logout':
				return await handleLogout()
			default:
				return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
		}
	} catch (error) {
		console.error('Auth error:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}

async function handleLogin(data: { email: string; password: string }) {
	const { error } = validateLogin(data)
	if (error) {
		return NextResponse.json(
			{ error: error.details[0].message },
			{ status: 400 }
		)
	}

	const user = await prisma.user.findUnique({
		where: { email: data.email },
		select: { id: true, email: true, name: true, password: true },
	})

	if (!user) {
		return NextResponse.json({ error: 'User not found' }, { status: 404 })
	}

	const isValid = await verify(user.password, data.password)
	if (!isValid) {
		return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
	}

	const { accessToken, refreshToken } = createTokens(user.id)

	const response = NextResponse.json({
		user: { id: user.id, email: user.email, name: user.name },
		accessToken,
	})

	setRefreshTokenCookie(response, refreshToken)

	return response
}

async function handleRegister(data: {
	name: string
	email: string
	password: string
}) {
	const { error } = validateRegister(data)
	if (error) {
		return NextResponse.json(
			{ error: error.details[0].message },
			{ status: 400 }
		)
	}

	const existingUser = await prisma.user.findUnique({
		where: { email: data.email },
	})

	if (existingUser) {
		return NextResponse.json(
			{ error: 'User with this email already exists' },
			{ status: 409 }
		)
	}

	const hashedPassword = await hash(data.password)
	const user = await prisma.user.create({
		data: {
			name: data.name,
			email: data.email,
			password: hashedPassword,
		},
		select: { id: true, email: true, name: true },
	})

	const { accessToken, refreshToken } = createTokens(user.id)

	const response = NextResponse.json({
		user,
		accessToken,
	})

	setRefreshTokenCookie(response, refreshToken)

	return response
}

async function handleRefresh() {
	const refreshToken = cookies().get(REFRESH_TOKEN_NAME)?.value

	if (!refreshToken) {
		return NextResponse.json(
			{ error: 'Refresh token not found' },
			{ status: 401 }
		)
	}

	const decoded = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET!)
	if (!decoded) {
		return NextResponse.json(
			{ error: 'Invalid refresh token' },
			{ status: 401 }
		)
	}

	const user = await prisma.user.findUnique({
		where: { id: decoded.id },
		select: { id: true, email: true, name: true },
	})

	if (!user) {
		return NextResponse.json({ error: 'User not found' }, { status: 404 })
	}

	const { accessToken, refreshToken: newRefreshToken } = createTokens(user.id)

	const response = NextResponse.json({
		user,
		accessToken,
	})

	setRefreshTokenCookie(response, newRefreshToken)

	return response
}

async function handleLogout() {
	const response = NextResponse.json({ message: 'Logout successful' })
	clearRefreshTokenCookie(response)
	response.cookies.delete('access_token')
	return response
}
