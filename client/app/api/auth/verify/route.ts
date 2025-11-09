import { verifyToken } from '@/lib/auth/tokens'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
	const accessToken = request.cookies.get('access_token')?.value
	const refreshToken = request.cookies.get('refresh_token')?.value

	try {
		if (accessToken) {
			const decoded = verifyToken(accessToken, process.env.JWT_SECRET!)
			if (decoded) {
				const user = await prisma.user.findUnique({
					where: { id: decoded.id },
					select: { id: true, email: true, name: true },
				})

				if (user) {
					return NextResponse.json({ user, valid: true })
				}
			}
		}

		if (refreshToken) {
			const decoded = verifyToken(
				refreshToken,
				process.env.REFRESH_TOKEN_SECRET!
			)
			if (decoded) {
				const user = await prisma.user.findUnique({
					where: { id: decoded.id },
					select: { id: true, email: true, name: true },
				})

				if (user) {
					return NextResponse.json({
						user,
						needsRefresh: true,
						valid: true,
					})
				}
			}
		}

		return NextResponse.json({ valid: false }, { status: 401 })
	} catch (error) {
		return NextResponse.json({ valid: false }, { status: 401 })
	}
}
