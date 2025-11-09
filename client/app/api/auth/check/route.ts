import { verifyToken } from '@/lib/auth/tokens'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
	const accessToken = request.cookies.get('access_token')?.value

	if (!accessToken) {
		return NextResponse.json({ authenticated: false }, { status: 401 })
	}

	try {
		const decoded = verifyToken(accessToken, process.env.JWT_SECRET!)
		if (!decoded) {
			return NextResponse.json({ authenticated: false }, { status: 401 })
		}

		const user = await prisma.user.findUnique({
			where: { id: decoded.id },
			select: { id: true, email: true, name: true },
		})

		if (!user) {
			return NextResponse.json({ authenticated: false }, { status: 401 })
		}

		return NextResponse.json({
			authenticated: true,
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
			},
		})
	} catch (error) {
		console.error('Auth check error:', error)
		return NextResponse.json({ authenticated: false }, { status: 401 })
	}
}
