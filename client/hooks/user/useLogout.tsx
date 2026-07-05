'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import authService from '@/services/auth/auth.service'

export function useLogout() {
	const router = useRouter()

	const logout = async (redirectTo?: string) => {
		try {
			await authService.logout()
			toast.success('You have successfully logged out')

			if (redirectTo) {
				// Full page reload on redirect
				window.location.href = redirectTo
			} else {
				// If no redirect is specified, just refresh the current page
				window.location.reload()
			}
		} catch (error) {
			toast.error('Error logging out')
			console.error('Logout error:', error)
		}
	}

	return { logout }
}
