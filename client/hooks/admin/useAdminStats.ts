'use client'

import { adminService } from '@/services/admin/admin.service'
import { useQuery } from '@tanstack/react-query'

export function useAdminStats() {
	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ['admin', 'stats'],
		queryFn: () => adminService.getStats(),
		refetchInterval: 30000, // Auto-refresh every 30 seconds
		retry: 2,
		staleTime: 10000, // Consider data stale after 10s
	})

	return {
		stats: data,
		isLoading,
		error,
		refetch,
	}
}
