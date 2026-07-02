'use client'

import { adminService } from '@/services/admin/admin.service'
import { useQuery } from '@tanstack/react-query'

interface UseUsersOptions {
	page?: number
	limit?: number
	search?: string
}

export function useUsers(options?: UseUsersOptions) {
	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ['admin-users', options],
		queryFn: () => adminService.getUsers(options),
		refetchInterval: 30000, // 30 seconds
	})

	return {
		users: data,
		isLoading,
		error,
		refetch,
	}
}
