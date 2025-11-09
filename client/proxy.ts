// Это ваш proxy файл (ранее middleware)
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// ИЗМЕНЕНО: middleware → proxy
export async function proxy(request: NextRequest) {
	// Просто проксируем запросы к API
	if (request.nextUrl.pathname.startsWith('/api')) {
		return NextResponse.next()
	}

	// Для остальных маршрутов используем стандартную логику
	return NextResponse.next()
}

export const config = {
	matcher: ['/((?!_next|.*\\..*).*)'],
}
