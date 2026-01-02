'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { AnimatePresence, m } from 'framer-motion'
import { CheckCircle2, ChevronRight, RotateCcw, X, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface Task {
	id: string
	order: number
	type: 'SINGLE_CHOICE' | 'MULTI_CHOICE'
	title: string
	question?: string
	points: number
	difficulty: 'EASY' | 'MEDIUM' | 'HARD'
	options: Array<{ id: string; text: string }>
	completed?: boolean
}

interface TaskModalProps {
	isOpen: boolean
	onClose: () => void
	tasks: Task[]
	currentTaskIndex: number
	onTaskChange: (index: number) => void
	lessonId: string
	courseSlug: string
	hasNextLesson?: boolean
	hasPrevLesson?: boolean
	onNextLesson?: () => void
	onPrevLesson?: () => void
	answerTask: (taskId: string, selectedOptionIds: string[]) => void // ✅
	isAnswering: boolean // ✅ Добавили
}

export function TaskModal({
	isOpen,
	onClose,
	tasks,
	currentTaskIndex,
	onTaskChange,
	lessonId,
	courseSlug,
	hasNextLesson,
	hasPrevLesson,
	onNextLesson,
	onPrevLesson,
	answerTask, // ✅ Получаем из props
	isAnswering, // ✅ Получаем из props
}: TaskModalProps) {
	const [selectedOptions, setSelectedOptions] = useState<string[]>([])
	const [hasSubmitted, setHasSubmitted] = useState(false) // ✅ Флаг отправки

	const currentTask = tasks[currentTaskIndex]
	const isMultiChoice = currentTask?.type === 'MULTI_CHOICE'
	const isLastTask = currentTaskIndex >= tasks.length - 1
	const isFirstTask = currentTaskIndex === 0

	// ✅ Сбрасываем состояние при смене задачи
	useEffect(() => {
		setSelectedOptions([])
		setHasSubmitted(false)
	}, [currentTaskIndex])

	// Keyboard shortcuts
	useEffect(() => {
		if (!isOpen) return

		const handleKeyDown = (e: KeyboardEvent) => {
			// Enter для отправки
			if (
				e.key === 'Enter' &&
				!hasSubmitted &&
				selectedOptions.length > 0 &&
				!isAnswering
			) {
				handleSubmit()
			}

			// Escape для закрытия
			if (e.key === 'Escape') {
				onClose()
			}

			// Стрелки для навигации
			if (e.key === 'ArrowRight' && hasSubmitted && !isLastTask) {
				handleNext()
			}

			if (e.key === 'ArrowLeft' && !isFirstTask) {
				handlePrev()
			}

			// R для повтора
			if (e.key === 'r' && hasSubmitted && currentTask.completed === false) {
				handleRetry()
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [isOpen, hasSubmitted, selectedOptions, isAnswering, currentTaskIndex])

	const handleOptionToggle = (optionId: string) => {
		if (hasSubmitted) return

		if (isMultiChoice) {
			setSelectedOptions(prev =>
				prev.includes(optionId)
					? prev.filter(id => id !== optionId)
					: [...prev, optionId]
			)
		} else {
			setSelectedOptions([optionId])
		}
	}

	const handleSubmit = () => {
		if (selectedOptions.length === 0) {
			toast.error('Выберите хотя бы один вариант')
			return
		}

		// ✅ Вызываем answerTask из хука (обновляет кэш React Query)
		answerTask(currentTask.id, selectedOptions)
		setHasSubmitted(true)
	}

	const handleNext = () => {
		if (currentTaskIndex < tasks.length - 1) {
			onTaskChange(currentTaskIndex + 1)
		}
	}

	const handlePrev = () => {
		if (currentTaskIndex > 0) {
			onTaskChange(currentTaskIndex - 1)
		}
	}

	const handleRetry = () => {
		setSelectedOptions([])
		setHasSubmitted(false)
	}

	const progress = ((currentTaskIndex + 1) / tasks.length) * 100

	if (!currentTask) return null

	// ✅ Определяем результат из task.completed
	const isCorrect = currentTask.completed && hasSubmitted

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Overlay */}
					<m.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className='w-screen h-screen fixed inset-0 bg-black/60 backdrop-blur-sm z-50'
					/>

					{/* Modal */}
					<m.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						className='fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-2xl max-h-[90vh] z-50 flex flex-col bg-[#111728] backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden'
					>
						{/* Close Button */}
						<button
							onClick={onClose}
							className='absolute top-4 right-4 z-10 w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors'
						>
							<X className='w-5 h-5' />
						</button>

						{/* Header */}
						<div className='p-6 border-b border-white/10'>
							<div className='flex items-center gap-4 mb-4'>
								<h2 className='text-xl font-black text-white'>
									Задание {currentTaskIndex + 1}/{tasks.length}
								</h2>
								<Badge className='bg-white/10 border-white/20 text-white/80 px-3 py-1'>
									{currentTask.points} XP
								</Badge>
							</div>

							{/* Progress */}
							<div className='relative h-2 bg-white/5 rounded-full overflow-hidden'>
								<m.div
									initial={{ width: 0 }}
									animate={{ width: `${progress}%` }}
									className='h-full bg-linear-to-r from-blue-500 to-purple-500'
								/>
							</div>
						</div>

						{/* Content */}
						<div className='flex-1 overflow-y-auto p-6 space-y-6'>
							{/* Question */}
							<div className='space-y-3'>
								<div className='flex flex-wrap gap-2'>
									<Badge
										className={cn(
											'px-3 py-1 rounded-lg',
											currentTask.difficulty === 'EASY' &&
												'bg-green-500/10 border-green-500/20 text-green-400',
											currentTask.difficulty === 'MEDIUM' &&
												'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
											currentTask.difficulty === 'HARD' &&
												'bg-red-500/10 border-red-500/20 text-red-400'
										)}
									>
										{currentTask.difficulty === 'EASY' && 'Лёгкое'}
										{currentTask.difficulty === 'MEDIUM' && 'Среднее'}
										{currentTask.difficulty === 'HARD' && 'Сложное'}
									</Badge>
									{isMultiChoice && (
										<Badge className='bg-blue-500/10 border-blue-500/20 text-blue-400 px-3 py-1 rounded-lg'>
											Выберите несколько
										</Badge>
									)}
								</div>

								<h3 className='text-2xl font-black text-white'>
									{currentTask.question || currentTask.title}
								</h3>
							</div>

							{/* Options */}
							<div className='space-y-3'>
								{currentTask.options.map(option => (
									<m.button
										key={option.id}
										onClick={() => handleOptionToggle(option.id)}
										disabled={hasSubmitted}
										whileHover={!hasSubmitted ? { scale: 1.01, x: 4 } : {}}
										whileTap={!hasSubmitted ? { scale: 0.98 } : {}}
										className={cn(
											'w-full text-left p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden',
											selectedOptions.includes(option.id)
												? 'bg-blue-500/20 border-blue-400/40 shadow-lg ring-2 ring-blue-400/20'
												: 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10',
											hasSubmitted && 'cursor-not-allowed opacity-60'
										)}
									>
										<div className='flex items-center gap-3'>
											<div
												className={cn(
													'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
													selectedOptions.includes(option.id)
														? 'border-blue-500 bg-blue-500'
														: 'border-white/30'
												)}
											>
												{selectedOptions.includes(option.id) && (
													<CheckCircle2 className='w-4 h-4 text-white' />
												)}
											</div>
											<span className='text-sm text-white font-medium flex-1'>
												{option.text}
											</span>
										</div>
									</m.button>
								))}
							</div>

							{/* Result */}
							{hasSubmitted && (
								<m.div
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									className={cn(
										'p-6 rounded-2xl border-2',
										isCorrect
											? 'bg-emerald-500/10 border-emerald-500/30'
											: 'bg-red-500/10 border-red-500/30'
									)}
								>
									<div className='flex items-start gap-4'>
										<div
											className={cn(
												'w-12 h-12 rounded-2xl flex items-center justify-center',
												isCorrect ? 'bg-emerald-500/20' : 'bg-red-500/20'
											)}
										>
											{isCorrect ? (
												<CheckCircle2 className='w-6 h-6 text-emerald-400' />
											) : (
												<XCircle className='w-6 h-6 text-red-400' />
											)}
										</div>
										<div>
											<h4
												className={cn(
													'text-lg font-black mb-2',
													isCorrect ? 'text-emerald-400' : 'text-red-400'
												)}
											>
												{isCorrect ? 'Правильно!' : 'Неправильно'}
											</h4>
											<p className='text-sm text-white/70'>
												{isCorrect
													? `Вы получили ${currentTask.points} опыта`
													: 'Попробуйте ещё раз или выберите другой вариант'}
											</p>
										</div>
									</div>
								</m.div>
							)}
						</div>

						{/* Footer */}
						<div className='p-6 border-t border-white/10 space-y-3'>
							{!hasSubmitted ? (
								<Button
									onClick={handleSubmit}
									disabled={selectedOptions.length === 0 || isAnswering}
									className='w-full h-12 rounded-xl bg-white hover:bg-white/90 text-black font-bold disabled:opacity-50 shadow-lg'
								>
									{isAnswering ? 'Отправка...' : 'Проверить ответ'}
								</Button>
							) : (
								<div className='flex gap-3'>
									{!isCorrect && (
										<Button
											onClick={handleRetry}
											variant='outline'
											className='flex-1 h-12 rounded-xl border-white/20 text-white hover:bg-white/10'
										>
											<RotateCcw className='w-4 h-4 mr-2' />
											Повторить
										</Button>
									)}
									{!isLastTask && (
										<Button
											onClick={handleNext}
											className='flex-1 h-12 rounded-xl bg-white hover:bg-white/90 text-black font-bold shadow-lg'
										>
											Далее
											<ChevronRight className='w-4 h-4 ml-2' />
										</Button>
									)}
								</div>
							)}
						</div>
					</m.div>
				</>
			)}
		</AnimatePresence>
	)
}
