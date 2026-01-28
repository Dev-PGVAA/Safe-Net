import { adminService } from '@/services/admin/admin.service'
import { ITest } from '@/services/admin/admin.types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

/**
 * Query keys для инвалидации кеша
 */
const TESTS_QUERY_KEYS = {
	all: ['tests'] as const,
	detail: (id: string) => ['test', id] as const,
}

interface UseTestsReturn {
	tests: ITest[] | undefined
	isLoading: boolean
	error: Error | null
	refetch: () => void
	deleteTest: (testId: string) => Promise<void>
	isDeleting: boolean
}

/**
 * Хук для управления списком тестов
 * Инкапсулирует логику работы с API и состоянием
 */
export function useTests(): UseTestsReturn {
	const queryClient = useQueryClient()

	// Получение списка тестов
	const {
		data: tests,
		isLoading,
		error,
		refetch,
	} = useQuery<ITest[], Error>({
		queryKey: TESTS_QUERY_KEYS.all,
		queryFn: () => adminService.getTests(),
		staleTime: 5 * 60 * 1000, // 5 минут
		gcTime: 10 * 60 * 1000, // 10 минут (бывший cacheTime)
	})

	// Мутация удаления теста
	const deleteMutation = useMutation({
		mutationFn: async (testId: string) => {
			await adminService.deleteTest(testId)
			return testId
		},
		onSuccess: deletedTestId => {
			// Оптимистичное обновление UI
			queryClient.setQueryData<ITest[]>(TESTS_QUERY_KEYS.all, old => {
				return old?.filter(test => test.id !== deletedTestId) ?? []
			})

			// Инвалидация кеша для консистентности
			queryClient.invalidateQueries({ queryKey: TESTS_QUERY_KEYS.all })

			toast.success('Тест успешно удален')
		},
		onError: (error: Error) => {
			console.error('[useTests] Delete error:', error)
			toast.error('Ошибка при удалении теста')
		},
	})

	return {
		tests,
		isLoading,
		error: error as Error | null,
		refetch,
		deleteTest: deleteMutation.mutateAsync,
		isDeleting: deleteMutation.isPending,
	}
}
