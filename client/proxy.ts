import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import jwt from 'jsonwebtoken'


export async function proxy(request: NextRequest) {
	if (request.nextUrl.pathname.startsWith('/api')) {
		return NextResponse.next()
	}
	const token = request.cookies.get('accessToken')?.value
	const protectedPaths = ['/dashboard']
	const publicPaths = ['/', '/about', '/contact']
	const pathname = request.nextUrl.pathname
	const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path))
	const isPublicPath = publicPaths.some((path) => pathname === path)
	if (isProtectedPath && !token) {
		return NextResponse.redirect(new URL('/', request.url))
	}
	if (isProtectedPath && token) {
		try {
			jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key')
		} catch (error) {
			const response = NextResponse.redirect(new URL('/', request.url))
			response.cookies.delete('accessToken')
			return response
		}
	}
	return NextResponse.next()
}
export const config = {
	matcher: ['/((?!_next|.*\\..*).*)', '/dashboard/:path*']
}
