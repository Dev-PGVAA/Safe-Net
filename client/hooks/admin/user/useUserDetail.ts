'use client'

import { adminService } from '@/services/admin/admin.service'
import { useQuery } from '@tanstack/react-query'

export function useUserDetail(userId: string) {
	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ['admin-user', userId],
		queryFn: () => adminService.getUserDetail(userId),
		refetchInterval: 60000, // 1 minute
		enabled: !!userId,
	})

	return {
		user: data,
		isLoading,
		error,
		refetch,
	}
}
