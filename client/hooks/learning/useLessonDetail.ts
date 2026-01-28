'use client'

import {
    ILesson,
    ITask,
    learningService,
} from '@/services/learning/learning.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'

type LessonWithNav = ILesson & {
	courseTitle: string
	courseSlug: string
	estimatedDuration: number
	previousLessonId?: string | null
	nextLessonId?: string | null
}

export function useLessonDetail() {
	const params = useParams()
	const router = useRouter()
	const queryClient = useQueryClient()
	const lessonId = params.id as string

	const {
		data: lesson,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ['lesson', lessonId],
		queryFn: async () => {
			const data = await learningService.getLessonDetail(lessonId)
			return {
				...data,
				courseTitle: data.courseTitle,
				courseSlug: data.courseSlug,
				estimatedDuration: data.estimatedDuration || 15,
			} as LessonWithNav
		},
		enabled: !!lessonId,
	})

	// Локальные вычисления прогресса
	const tasks = (lesson?.tasks || []) as ITask[]
	const totalTasks = tasks.length
	const completedTasks = tasks.filter(t => t.completed).length
	const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

	// ✅ Мутация для отправки ответа на задачу
	const answerMutation = useMutation({
		mutationFn: (payload: { taskId: string; selectedOptionIds: string[] }) =>
			learningService.answerTask(payload.taskId, {
				selectedOptionIds: payload.selectedOptionIds,
			}),
		onSuccess: (res, variables) => {
			// Обновляем кэш урока
			queryClient.setQueryData(['lesson', lessonId], (prev: any) => {
				if (!prev || !prev.tasks) return prev
				return {
					...prev,
					tasks: prev.tasks.map((task: ITask) =>
						task.id === variables.taskId
							? { ...task, completed: res.isCorrect }
							: task
					),
				}
			})

			// Показываем результат
			if (res.isCorrect) {
				toast.success(`Правильно! +${res.awardedXp} XP`)
			} else {
				toast.error('Неправильно. Попробуйте ещё раз!')
			}

			// Если урок завершён
			if (res.lessonCompleted) {
				toast.success('Урок завершён!')
			}

			// Если выдан сертификат
			if (res.certificateIssued) {
				toast.success('Получен сертификат!')
			}
		},
		onError: error => {
			toast.error('Ошибка при отправке ответа')
			console.error(error)
		},
	})

	// ✅ ИЗМЕНЕНИЕ: возвращаем Promise с результатом
	const answerTask = async (taskId: string, selectedOptionIds: string[]) => {
		const result = await answerMutation.mutateAsync({ taskId, selectedOptionIds })
		return result // ✅ Возвращаем результат { isCorrect, awardedXp, ... }
	}

	// Навигация по урокам
	const goToPrevLesson = () => {
		if (lesson?.previousLessonId) {
			router.push(
				`/dashboard/courses/${lesson.courseSlug}/${lesson.previousLessonId}`
			)
		}
	}

	const goToNextLesson = () => {
		if (lesson?.nextLessonId) {
			router.push(
				`/dashboard/courses/${lesson.courseSlug}/${lesson.nextLessonId}`
			)
		}
	}

	return {
		lesson: lesson || null,
		isLoading,
		isError,
		error,
		// Прогресс
		tasks,
		totalTasks,
		completedTasks,
		progress,
		estimatedDuration: lesson?.estimatedDuration || 1080,
		// Работа с ответами
		answerTask,
		isAnswering: answerMutation.isPending,
		// Навигация
		goToPrevLesson,
		goToNextLesson,
	}
}
