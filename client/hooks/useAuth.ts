'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface User {
	id: string
	email: string
	name?: string
}

interface AuthResponse {
	user: User
	accessToken: string
}

export function useAuth() {
	const [user, setUser] = useState<User | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const router = useRouter()

	useEffect(() => {
		// Проверяем аутентификацию при загрузке
		const checkAuth = async () => {
			try {
				const response = await fetch('/api/auth/check')
				if (response.ok) {
					const data = await response.json()
					setUser(data.user)
				}
			} catch (err) {
				console.error('Auth check failed:', err)
			} finally {
				setIsLoading(false)
			}
		}

		checkAuth()
	}, [])

	const login = async (email: string, password: string) => {
		setError(null)
		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password }),
			})

			if (!response.ok) {
				const data = await response.json()
				throw new Error(data.error || 'Login failed')
			}

			const data: AuthResponse = await response.json()

			// Сохраняем access token (для API calls)
			document.cookie = `access_token=${
				data.accessToken
			}; path=/; max-age=3600; ${
				process.env.NODE_ENV === 'production' ? 'secure; ' : ''
			}sameSite=Lax`

			setUser(data.user)
			return { success: true, user: data.user }
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Login failed'
			setError(errorMessage)
			return { success: false, error: errorMessage }
		}
	}

	const register = async (name: string, email: string, password: string) => {
		setError(null)
		try {
			const response = await fetch('/api/auth/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, password }),
			})

			if (!response.ok) {
				const data = await response.json()
				throw new Error(data.error || 'Registration failed')
			}

			const data: AuthResponse = await response.json()

			// Сохраняем access token
			document.cookie = `access_token=${
				data.accessToken
			}; path=/; max-age=3600; ${
				process.env.NODE_ENV === 'production' ? 'secure; ' : ''
			}sameSite=Lax`

			setUser(data.user)
			return { success: true, user: data.user }
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'Registration failed'
			setError(errorMessage)
			return { success: false, error: errorMessage }
		}
	}

	const logout = async () => {
		try {
			await fetch('/api/auth/logout', {
				method: 'POST',
				credentials: 'include',
			})

			// Очищаем access token
			document.cookie = 'access_token=; path=/; max-age=0; sameSite=Lax'

			setUser(null)
			router.push('/')
		} catch (err) {
			console.error('Logout failed:', err)
		}
	}

	return {
		user,
		isLoading,
		error,
		login,
		register,
		logout,
		isAuthenticated: !!user,
	}
}
