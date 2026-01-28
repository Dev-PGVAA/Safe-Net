'use client'

import { publicService } from '@/services/public/public.service'
import { useQuery } from '@tanstack/react-query'

export function usePublicStats() {
	const { data, isLoading, error } = useQuery({
		queryKey: ['public-stats'],
		queryFn: () => publicService.getStats(),
		staleTime: 5 * 60 * 1000, // 5 минут кеш
		retry: 1,
	})

	return {
		stats: data,
		isLoading,
		error,
	}
}
