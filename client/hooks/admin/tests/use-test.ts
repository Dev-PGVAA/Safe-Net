import { adminService } from '@/services/admin/admin.service'
import { ITest } from '@/services/admin/admin.types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface UseTestReturn {
	test: ITest | undefined
	isLoading: boolean
	error: Error | null
	refetch: () => void
	updateTest: (data: Partial<ITest>) => Promise<void>
	isUpdating: boolean
}

/**
 * Хук для работы с отдельным тестом
 * Обеспечивает типобезопасность и инкапсуляцию логики
 */
export function useTest(testId: string): UseTestReturn {
	const queryClient = useQueryClient()

	// Получение деталей теста
	const {
		data: test,
		isLoading,
		error,
		refetch,
	} = useQuery<ITest, Error>({
		queryKey: ['test', testId],
		queryFn: () => adminService.getTest(testId),
		enabled: Boolean(testId), // Защита от пустого ID
		staleTime: 2 * 60 * 1000, // 2 минуты
	})

	// Мутация обновления теста
	const updateMutation = useMutation({
		mutationFn: async (data: Partial<ITest>) => {
			await adminService.updateTest(testId, data)
			return data
		},
		onMutate: async updatedData => {
			// Отменяем предыдущие запросы для оптимистичного обновления
			await queryClient.cancelQueries({ queryKey: ['test', testId] })

			// Сохраняем предыдущие данные для отката
			const previousTest = queryClient.getQueryData<ITest>(['test', testId])

			// Оптимистичное обновление
			if (previousTest) {
				queryClient.setQueryData<ITest>(['test', testId], {
					...previousTest,
					...updatedData,
				})
			}

			return { previousTest }
		},
		onError: (error: Error, _variables, context) => {
			// Откат при ошибке
			if (context?.previousTest) {
				queryClient.setQueryData(['test', testId], context.previousTest)
			}

			console.error('[useTest] Update error:', error)
			toast.error('Ошибка при обновлении теста')
		},
		onSuccess: () => {
			// Инвалидация связанных запросов
			queryClient.invalidateQueries({ queryKey: ['test', testId] })
			queryClient.invalidateQueries({ queryKey: ['tests'] })

			toast.success('Тест обновлен')
		},
	})

	return {
		test,
		isLoading,
		error: error as Error | null,
		refetch,
		updateTest: updateMutation.mutateAsync,
		isUpdating: updateMutation.isPending,
	}
}
