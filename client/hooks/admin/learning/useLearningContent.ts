'use client'

import { adminService } from '@/services/admin/admin.service'
import { useQuery } from '@tanstack/react-query'

export function useLearningContent() {
	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ['learning-content', 'stages'],
		queryFn: () => adminService.getStages(),
		refetchInterval: 60000, // 1 минута
	})

	return {
		stages: data,
		isLoading,
		error,
		refetch,
	}
}
