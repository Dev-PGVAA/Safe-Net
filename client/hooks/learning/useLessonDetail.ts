'use client'

import {
	ILesson,
	ITask,
	ITaskAnswerResponse,
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

// ✅ Утилита для работы с localStorage
const getCompletedTasks = (): Set<string> => {
	if (typeof window === 'undefined') return new Set()
	const stored = localStorage.getItem('completedTasks')
	return stored ? new Set(JSON.parse(stored)) : new Set()
}

const saveCompletedTask = (taskId: string) => {
	const completed = getCompletedTasks()
	completed.add(taskId)
	localStorage.setItem('completedTasks', JSON.stringify([...completed]))
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

			// ✅ Применяем сохраненное состояние completed из localStorage
			const completedTasks = getCompletedTasks()
			const tasksWithCompleted = data.tasks?.map(task => ({
				...task,
				completed: task.completed || completedTasks.has(task.id),
			}))

			return {
				...data,
				tasks: tasksWithCompleted,
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
		mutationFn: (payload: {
			taskId: string
			selectedOptionIds: string[]
			textAnswer?: string
		}) =>
			learningService.answerTask(payload.taskId, {
				selectedOptionIds: payload.selectedOptionIds,
				textAnswer: payload.textAnswer,
			}),
		onSuccess: (res: ITaskAnswerResponse, variables) => {
			// ✅ Сохраняем в localStorage если правильный ответ
			if (res.isCorrect) {
				saveCompletedTask(variables.taskId)
			}

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

			// ✅ Показываем результат с объяснением
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

			// ✅ Если есть новые достижения
			if (res.newAchievements && res.newAchievements.length > 0) {
				res.newAchievements.forEach(achievement => {
					toast.success(`Получено достижение: ${achievement.title}`)
				})
			}
		},
		onError: error => {
			toast.error('Ошибка при отправке ответа')
			console.error(error)
		},
	})

	// ✅ Возвращаем Promise с результатом (включая explanation)
	const answerTask = async (
		taskId: string,
		selectedOptionIds: string[],
		textAnswer?: string
	): Promise<ITaskAnswerResponse> => {
		const result = await answerMutation.mutateAsync({
			taskId,
			selectedOptionIds,
			textAnswer,
		})
		return result
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
