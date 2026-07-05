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
	explanation?: string
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
	answerTask: (taskId: string, selectedOptionIds: string[]) => Promise<{
  	isCorrect: boolean;
  	explanation?: string  // ✅ Add this
		awardedXp: number
	}>
	isAnswering: boolean
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
	answerTask,
	isAnswering,
}: TaskModalProps) {
	const [selectedOptions, setSelectedOptions] = useState<string[]>([])
	const [hasSubmitted, setHasSubmitted] = useState(false)
	const [answerResult, setAnswerResult] = useState<{
	  isCorrect: boolean
	  explanation?: string
	  awardedXp: number
	} | null>(null)

	const currentTask = tasks[currentTaskIndex]
	const isMultiChoice = currentTask?.type === 'MULTI_CHOICE'
	const isLastTask = currentTaskIndex >= tasks.length - 1
	const isFirstTask = currentTaskIndex === 0

	// ✅ Reset state when the task changes
	useEffect(() => {
		setSelectedOptions([])
		setHasSubmitted(false)
		setAnswerResult(null)
	}, [currentTaskIndex])

	// Keyboard shortcuts
	useEffect(() => {
		if (!isOpen) return

		const handleKeyDown = (e: KeyboardEvent) => {
			if (
				e.key === 'Enter' &&
				!hasSubmitted &&
				selectedOptions.length > 0 &&
				!isAnswering
			) {
				handleSubmit()
			}

			if (e.key === 'Escape') {
				onClose()
			}

			if (e.key === 'ArrowRight' && hasSubmitted && !isLastTask) {
				handleNext()
			}

			if (e.key === 'ArrowLeft' && !isFirstTask) {
				handlePrev()
			}

			if (e.key === 'r' && hasSubmitted && answerResult === false) {
				handleRetry()
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [isOpen, hasSubmitted, selectedOptions, isAnswering, currentTaskIndex, answerResult])

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

	const handleSubmit = async () => {
		if (selectedOptions.length === 0) {
			toast.error('Select at least one option')
			return
		}

		try {
			// ✅ Get result from the API
			const result = await answerTask(currentTask.id, selectedOptions)

			// ✅ Immediately store the result in local state
			setAnswerResult(result)
			setHasSubmitted(true)
		} catch (error) {
			toast.error('Error submitting answer')
		}
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
		setAnswerResult(null)
	}

	const progress = ((currentTaskIndex + 1) / tasks.length) * 100

	if (!currentTask) return null

	const isCorrect = answerResult?.isCorrect === true


	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Overlay */}
					<m.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className='fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm h-screen'
						onClick={onClose}
					/>

					{/* Modal */}
					<m.div
						initial={{ opacity: 0, scale: 0.95, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 20 }}
						className='fixed left-1/2 top-1/2 z-[101] w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/10 bg-[#0A0F1D] p-8 shadow-2xl'
						onClick={e => e.stopPropagation()}
					>
						{/* Close Button */}
						<button
							onClick={onClose}
							className='absolute right-6 top-6 rounded-xl bg-white/5 p-3 text-gray-400 transition-colors hover:bg-white/10 hover:text-white'
						>
							<X className='h-5 w-5' />
						</button>

						{/* Header */}
						<div className='mb-6 flex items-center justify-between'>
							<div>
								<h3 className='text-2xl font-bold text-white'>
									Task {currentTaskIndex + 1}/{tasks.length}
								</h3>
								<Badge className='mt-2 bg-blue-500/20 text-blue-400'>
									{currentTask.points} XP
								</Badge>
							</div>
						</div>

						{/* Progress */}
						<div className='mb-6 h-2 overflow-hidden rounded-full bg-white/5'>
							<m.div
								initial={{ width: 0 }}
								animate={{ width: `${progress}%` }}
								transition={{ duration: 0.5 }}
								className='h-full bg-gradient-to-r from-blue-500 to-purple-500'
							/>
						</div>

						{/* Content */}
						<div className='space-y-6'>
							{/* Question */}
							<div>
								<div className='mb-3 flex items-center gap-2'>
									<Badge
										variant='outline'
										className={cn(
											'border-white/20',
											currentTask.difficulty === 'EASY' && 'border-green-500/40 text-green-400',
											currentTask.difficulty === 'MEDIUM' && 'border-yellow-500/40 text-yellow-400',
											currentTask.difficulty === 'HARD' && 'border-red-500/40 text-red-400'
										)}
									>
										{currentTask.difficulty === 'EASY' && 'Easy'}
										{currentTask.difficulty === 'MEDIUM' && 'Medium'}
										{currentTask.difficulty === 'HARD' && 'Hard'}
									</Badge>
									{isMultiChoice && (
										<Badge variant='outline' className='border-purple-500/40 text-purple-400'>
											Select multiple
										</Badge>
									)}
								</div>
								<p className='text-lg font-medium text-white'>
									{currentTask.question || currentTask.title}
								</p>
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
										{selectedOptions.includes(option.id) && (
											<m.div
												layoutId={`selected-${option.id}`}
												className='absolute right-4 top-1/2 -translate-y-1/2'
											>
												<CheckCircle2 className='h-5 w-5 text-blue-400' />
											</m.div>
										)}
										<span className='text-white'>{option.text}</span>
									</m.button>
								))}
							</div>

							{/* Result */}
							{hasSubmitted && answerResult !== null && (
								<m.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									className={cn(
										'rounded-2xl border p-4',
										isCorrect
											? 'border-green-500/40 bg-green-500/10'
											: 'border-red-500/40 bg-red-500/10'
									)}
								>
									<div className='flex items-center gap-3'>
										{isCorrect ? (
											<CheckCircle2 className='h-6 w-6 text-green-400' />
										) : (
											<XCircle className='h-6 w-6 text-red-400' />
										)}
										<div>
											<p className='font-semibold text-white'>
												{isCorrect ? 'Correct!' : 'Incorrect'}
											</p>
											<p className='text-sm text-gray-400'>
												{isCorrect && `You earned ${currentTask.points} XP`}
												{answerResult.explanation && (
												  <>{answerResult.explanation}</>
												)}
											</p>
										</div>
									</div>
								</m.div>
							)}
						</div>

						{/* Footer */}
						<div className='mt-6 flex gap-3'>
							{!hasSubmitted ? (
								<Button
									onClick={handleSubmit}
									disabled={selectedOptions.length === 0 || isAnswering}
									className='w-full rounded-xl bg-white py-6 text-base font-semibold text-black transition-colors hover:bg-white/90 disabled:opacity-50'
								>
									{isAnswering ? 'Submitting...' : 'Check answer'}
								</Button>
							) : (
								<>
									{!isCorrect && (
										<Button
											onClick={handleRetry}
											variant='outline'
											className='flex-1 rounded-xl border-white/10 py-6 text-base font-semibold'
										>
											<RotateCcw className='mr-2 h-5 w-5' />
											Retry
										</Button>
									)}
									{!isLastTask && (
										<Button
											onClick={handleNext}
											className='flex-1 rounded-xl bg-white py-6 text-base font-semibold text-black hover:bg-white/90'
										>
											Next
											<ChevronRight className='ml-2 h-5 w-5' />
										</Button>
									)}
								</>
							)}
						</div>
					</m.div>
				</>
			)}
		</AnimatePresence>
	)
}
