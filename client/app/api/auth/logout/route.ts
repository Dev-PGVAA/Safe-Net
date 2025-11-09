import { clearRefreshTokenCookie } from '@/lib/auth/tokens'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
	const response = NextResponse.json({ message: 'Успешный выход' })
	clearRefreshTokenCookie(response)
	return response
}
