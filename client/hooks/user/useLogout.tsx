'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import authService from '@/services/auth/auth.service'

export function useLogout() {
	const router = useRouter()

	const logout = async (redirectTo?: string) => {
		try {
			await authService.logout()
			toast.success('Вы успешно вышли из системы')

			if (redirectTo) {
				// Полная перезагрузка страницы при редиректе
				window.location.href = redirectTo
			} else {
				// Если редирект не указан, просто обновляем текущую страницу
				window.location.reload()
			}
		} catch (error) {
			toast.error('Ошибка при выходе из системы')
			console.error('Logout error:', error)
		}
	}

	return { logout }
}
