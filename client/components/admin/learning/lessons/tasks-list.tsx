'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { adminService } from '@/services/admin/admin.service'
import { ILesson, ITask, TaskType } from '@/services/admin/admin.types'
import { m } from 'framer-motion'
import {
    AlertTriangle,
    CheckCircle2,
    ChevronDown,
    Edit2,
    FileQuestion,
    ListChecks,
    Loader2,
    Plus,
    Sparkles,
    Target,
    Trash2,
    X,
} from 'lucide-react'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface TasksListProps {
	lesson: ILesson
	onRefetch: () => void
}

const TaskTypeIcons: Record<TaskType, any> = {
	[TaskType.SINGLE_CHOICE]: CheckCircle2,
	[TaskType.MULTI_CHOICE]: ListChecks,
	[TaskType.SHORT_ANSWER]: FileQuestion,
	[TaskType.PHISHING_EMAIL]: FileQuestion,
	[TaskType.PHISHING_SITE]: FileQuestion,
	[TaskType.TEXT_INPUT]: FileQuestion,
}

const TaskTypeLabels: Record<TaskType, string> = {
	[TaskType.SINGLE_CHOICE]: 'Один вариант',
	[TaskType.MULTI_CHOICE]: 'Несколько вариантов',
	[TaskType.SHORT_ANSWER]: 'Короткий ответ',
	[TaskType.PHISHING_EMAIL]: 'Фишинг: Email',
	[TaskType.PHISHING_SITE]: 'Фишинг: Сайт',
	[TaskType.TEXT_INPUT]: 'Текстовый ввод',
}

const DifficultyLabels = {
	EASY: 'Легкий',
	MEDIUM: 'Средний',
	HARD: 'Сложный',
}

export default function TasksList({ lesson, onRefetch }: TasksListProps) {
	const [deleteDialog, setDeleteDialog] = useState<{
		open: boolean
		task: ITask | null
	}>({ open: false, task: null })
	const [editDialog, setEditDialog] = useState<{
		open: boolean
		task: ITask | null
	}>({ open: false, task: null })
	const [isDeleting, setIsDeleting] = useState(false)

	const tasks = lesson.tasks || []

	const handleDelete = async () => {
		if (!deleteDialog.task) return

		setIsDeleting(true)
		try {
			await adminService.deleteTask(deleteDialog.task.id)
			toast.success('Задание удалено')
			setDeleteDialog({ open: false, task: null })
			onRefetch()
		} catch (error) {
			toast.error('Ошибка при удалении')
		} finally {
			setIsDeleting(false)
		}
	}

	const handleUpdate = async (data: any) => {
		if (!editDialog.task) return

		try {
			await adminService.updateTask(editDialog.task.id, data)
			toast.success('Задание обновлено')
			setEditDialog({ open: false, task: null })
			onRefetch()
		} catch (error) {
			toast.error('Ошибка при обновлении')
		}
	}

	if (tasks.length === 0) {
		return (
			<div className='p-8 text-center'>
				<div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-500/10'>
					<FileQuestion className='h-8 w-8 text-gray-500' />
				</div>
				<p className='text-sm text-gray-500'>
					Заданий пока нет. Добавьте первое!
				</p>
			</div>
		)
	}

	return (
		<>
			<div className='p-6'>
				<div className='space-y-3'>
					{tasks.map((task, index) => {
						const Icon = TaskTypeIcons[task.type] || FileQuestion
						return (
							<div
								key={task.id}
								className='group rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-white/20 hover:bg-white/10'
							>
								<div className='flex items-start justify-between gap-4'>
									<div className='flex flex-1 items-start gap-3'>
										<div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-green-500/10'>
											<Icon className='h-5 w-5 text-green-400' />
										</div>
										<div className='flex-1 min-w-0'>
											<div className='mb-1 flex items-center gap-2'>
												<span className='flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-green-500/20 text-xs font-bold text-green-400'>
													{task.order}
												</span>
												<h5 className='font-semibold text-white truncate'>
													{task.title}
												</h5>
											</div>
											{task.question && (
												<p className='text-sm text-gray-400 line-clamp-2 mb-2'>
													{task.question}
												</p>
											)}
											<div className='flex flex-wrap items-center gap-2 text-xs'>
												<span className='rounded-full bg-purple-500/10 px-2 py-1 text-purple-400'>
													{TaskTypeLabels[task.type]}
												</span>
												{task.points && (
													<span className='rounded-full bg-yellow-500/10 px-2 py-1 text-yellow-400'>
														{task.points} XP
													</span>
												)}
												{task.difficulty && (
													<span className='rounded-full bg-blue-500/10 px-2 py-1 text-blue-400'>
														{DifficultyLabels[task.difficulty]}
													</span>
												)}
											</div>
										</div>
									</div>
									<div className='flex gap-2 opacity-0 transition-opacity group-hover:opacity-100'>
										<button
											onClick={() => setEditDialog({ open: true, task })}
											className='rounded-lg bg-blue-500/10 p-2 text-blue-400 transition-colors hover:bg-blue-500/20'
											title='Редактировать'
										>
											<Edit2 className='h-4 w-4' />
										</button>
										<button
											onClick={() => setDeleteDialog({ open: true, task })}
											className='rounded-lg bg-red-500/10 p-2 text-red-400 transition-colors hover:bg-red-500/20'
											title='Удалить'
										>
											<Trash2 className='h-4 w-4' />
										</button>
									</div>
								</div>
							</div>
						)
					})}
				</div>
			</div>

			{/* Delete Dialog - Portal */}
			{deleteDialog.open &&
				deleteDialog.task &&
				createPortal(
					<m.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4'
						onClick={() => setDeleteDialog({ open: false, task: null })}
					>
						<m.div
							initial={{ opacity: 0, scale: 0.98 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.98 }}
							onClick={(e) => e.stopPropagation()}
							className='relative w-full max-w-md rounded-2xl border border-red-500/20 bg-[#0A0F1D] p-6 shadow-2xl'
						>
							<div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10'>
								<AlertTriangle className='h-8 w-8 text-red-400' />
							</div>

							<div className='text-center'>
								<h3 className='mb-2 text-2xl font-bold text-white'>
									Удалить задание?
								</h3>
								<p className='mb-2 text-gray-400'>
									Вы уверены, что хотите удалить задание{' '}
									<span className='font-semibold text-white'>
										"{deleteDialog.task.title}"
									</span>
									?
								</p>
								<p className='text-sm text-red-400'>
									Это действие нельзя отменить
								</p>
							</div>

							<div className='mt-6 flex gap-3'>
								<button
									onClick={() => setDeleteDialog({ open: false, task: null })}
									disabled={isDeleting}
									className='flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-gray-300 transition-colors hover:bg-white/10 disabled:opacity-50'
								>
									Отмена
								</button>
								<button
									onClick={handleDelete}
									disabled={isDeleting}
									className='flex-1 rounded-xl bg-red-500 px-4 py-3 font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-50'
								>
									{isDeleting ? (
										<>
											<Loader2 className='mr-2 inline h-4 w-4 animate-spin' />
											Удаление...
										</>
									) : (
										'Удалить'
									)}
								</button>
							</div>
						</m.div>
					</m.div>,
					document.body
				)}

			{/* Edit Dialog - Portal */}
			{editDialog.open &&
				editDialog.task &&
				createPortal(
					<EditTaskModal
						task={editDialog.task}
						onClose={() => setEditDialog({ open: false, task: null })}
						onSubmit={handleUpdate}
					/>,
					document.body
				)}
		</>
	)
}

interface EditTaskModalProps {
	task: ITask
	onClose: () => void
	onSubmit: (data: any) => void
}

function EditTaskModal({ task, onClose, onSubmit }: EditTaskModalProps) {
	const [isSubmitting, setIsSubmitting] = useState(false)

	const {
		register,
		handleSubmit,
		watch,
		control,
		formState: { errors },
	} = useForm({
		defaultValues: {
			order: task.order,
			title: task.title,
			question: task.question || '',
			explanation: task.explanation || '',
			points: task.points || 10,
			difficulty: task.difficulty || 'MEDIUM',
			type: task.type,
			options: task.options || [],
		},
	})

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'options',
	})

	const taskType = watch('type')
	const hasOptions =
		taskType === TaskType.SINGLE_CHOICE || taskType === TaskType.MULTI_CHOICE

	const onSubmitForm = async (data: any) => {
		setIsSubmitting(true)
		try {
			await onSubmit(data)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<m.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className='fixed inset-0 z-[9999] bg-[#0A0F1D] overflow-y-auto'
		>
			{/* Header */}
			<div className='sticky top-0 border-b border-white/10 bg-[#0A0F1D]/95 backdrop-blur-xl z-10'>
				<div className='mx-auto flex max-w-5xl items-center justify-between px-6 py-4'>
					<div>
						<h3 className='text-2xl font-bold text-white'>
							Редактировать задание
						</h3>
						<p className='mt-1 text-sm text-gray-500'>
							Измените параметры практического задания
						</p>
					</div>
					<button
						onClick={onClose}
						className='rounded-xl bg-white/5 p-3 text-gray-400 transition-colors hover:bg-white/10 hover:text-white'
					>
						<X className='h-5 w-5' />
					</button>
				</div>
			</div>

			{/* Content */}
			<div className='mx-auto max-w-5xl px-6 py-8'>
				<form onSubmit={handleSubmit(onSubmitForm)} className='space-y-8'>
					{/* Basic Info */}
					<div className='rounded-2xl border border-white/10 bg-white/5 p-6'>
						<h4 className='mb-4 flex items-center gap-2 text-lg font-semibold text-white'>
							<Sparkles className='h-5 w-5 text-blue-400' />
							Основная информация
						</h4>

						<div className='space-y-6'>
							<div className='grid gap-6 md:grid-cols-2'>
								<div>
									<label className='mb-2 block text-sm font-semibold text-white'>
										Порядковый номер
									</label>
									<input
										{...register('order', { valueAsNumber: true })}
										type='number'
										className='w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors focus:border-blue-500/50 focus:bg-white/10'
									/>
								</div>

								<div>
									<label className='mb-2 block text-sm font-semibold text-white'>
										Тип задания
									</label>
									<Controller
										name='type'
										control={control}
										render={({ field }) => (
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<button
														type='button'
														className='flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition-colors hover:bg-white/10'
													>
														<span>{TaskTypeLabels[field.value]}</span>
														<ChevronDown className='h-4 w-4 text-gray-400' />
													</button>
												</DropdownMenuTrigger>
												<DropdownMenuContent
													align='start'
													className='z-[10000] w-[var(--radix-dropdown-menu-trigger-width)] bg-[#0A0F1D] border-white/10'
												>
													{Object.entries(TaskTypeLabels).map(([key, label]) => (
														<DropdownMenuItem
															key={key}
															onClick={() => field.onChange(key)}
															className='text-white hover:bg-white/10 cursor-pointer'
														>
															{label}
														</DropdownMenuItem>
													))}
												</DropdownMenuContent>
											</DropdownMenu>
										)}
									/>
								</div>
							</div>

							<div>
								<label className='mb-2 block text-sm font-semibold text-white'>
									Название задания
								</label>
								<input
									{...register('title', { required: 'Название обязательно' })}
									className='w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors focus:border-blue-500/50 focus:bg-white/10'
									placeholder='SQL Injection'
								/>
								{errors.title && (
									<p className='mt-2 text-sm text-red-400'>
										{errors.title.message}
									</p>
								)}
							</div>

							<div>
								<label className='mb-2 block text-sm font-semibold text-white'>
									Вопрос
								</label>
								<textarea
									{...register('question')}
									rows={3}
									className='w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors focus:border-blue-500/50 focus:bg-white/10 resize-none'
									placeholder='Какой метод используется для SQL-инъекций?'
								/>
							</div>

							<div>
								<label className='mb-2 block text-sm font-semibold text-white'>
									Объяснение (опционально)
								</label>
								<textarea
									{...register('explanation')}
									rows={3}
									className='w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors focus:border-blue-500/50 focus:bg-white/10 resize-none'
									placeholder='SQL-инъекция позволяет...'
								/>
							</div>
						</div>
					</div>

					{/* Settings */}
					<div className='rounded-2xl border border-white/10 bg-white/5 p-6'>
						<h4 className='mb-4 flex items-center gap-2 text-lg font-semibold text-white'>
							<Target className='h-5 w-5 text-purple-400' />
							Настройки
						</h4>

						<div className='grid gap-6 md:grid-cols-2'>
							<div>
								<label className='mb-2 block text-sm font-semibold text-white'>
									Баллы (XP)
								</label>
								<input
									{...register('points', { valueAsNumber: true })}
									type='number'
									min='1'
									max='100'
									className='w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors focus:border-blue-500/50 focus:bg-white/10'
								/>
							</div>

							<div>
								<label className='mb-2 block text-sm font-semibold text-white'>
									Сложность
								</label>
								<Controller
									name='difficulty'
									control={control}
									render={({ field }) => (
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<button
													type='button'
													className='flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition-colors hover:bg-white/10'
												>
													<span>{DifficultyLabels[field.value]}</span>
													<ChevronDown className='h-4 w-4 text-gray-400' />
												</button>
											</DropdownMenuTrigger>
											<DropdownMenuContent
												align='start'
												className='z-[10000] w-[var(--radix-dropdown-menu-trigger-width)] bg-[#0A0F1D] border-white/10'
											>
												{Object.entries(DifficultyLabels).map(([key, label]) => (
													<DropdownMenuItem
														key={key}
														onClick={() => field.onChange(key)}
														className='text-white hover:bg-white/10 cursor-pointer'
													>
														{label}
													</DropdownMenuItem>
												))}
											</DropdownMenuContent>
										</DropdownMenu>
									)}
								/>
							</div>
						</div>
					</div>

					{/* Options */}
					{hasOptions && (
											<div className='rounded-2xl border border-white/10 bg-white/5 p-6'>
												<div className='mb-4 flex items-center justify-between'>
													<h4 className='flex items-center gap-2 text-lg font-semibold text-white'>
														<CheckCircle2 className='h-5 w-5 text-green-400' />
														Варианты ответов
													</h4>
													<button
														type='button'
														onClick={() => append({ text: '', isCorrect: false })}
														className='flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-white/90'
													>
														<Plus className='h-4 w-4' />
														Добавить вариант
													</button>
												</div>

												<div className='space-y-3'>
													{fields.map((field, index) => (
														<div key={field.id} className='flex items-center gap-3'>
															<Controller
																name={`options.${index}.isCorrect`}
																control={control}
																render={({ field: checkField }) => (
																	<input
																		type={taskType === TaskType.SINGLE_CHOICE ? 'radio' : 'checkbox'}
																		name={taskType === TaskType.SINGLE_CHOICE ? 'correctAnswer' : undefined}
																		checked={checkField.value}
																		onChange={(e) => {
																			if (taskType === TaskType.SINGLE_CHOICE) {
																				// Для radio - снимаем все остальные галочки
																				fields.forEach((_, i) => {
																					if (i === index) {
																						checkField.onChange(true)
																					} else {
																						control._formValues.options[i].isCorrect = false
																					}
																				})
																			} else {
																				// Для checkbox - просто переключаем
																				checkField.onChange(e.target.checked)
																			}
																		}}
																		className='h-5 w-5 shrink-0 cursor-pointer accent-green-500'
																	/>
																)}
															/>
															<input
																{...register(`options.${index}.text`)}
																className='flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors focus:border-green-500/50 focus:bg-white/10'
																placeholder={`Вариант ${index + 1}`}
															/>
															{fields.length > 2 && (
																<button
																	type='button'
																	onClick={() => remove(index)}
																	className='rounded-lg bg-red-500/10 p-3 text-red-400 transition-colors hover:bg-red-500/20'
																>
																	<Trash2 className='h-4 w-4' />
																</button>
															)}
														</div>
													))}
												</div>
												<p className='mt-3 text-xs text-gray-500'>
													{taskType === TaskType.SINGLE_CHOICE
														? 'Выберите один правильный ответ (radio)'
														: 'Отметьте все правильные ответы (checkbox)'}
												</p>
											</div>
					)}


					{/* Actions */}
					<div className='flex gap-4'>
						<button
							type='button'
							onClick={onClose}
							disabled={isSubmitting}
							className='flex-1 rounded-xl border border-white/10 bg-white/5 px-6 py-4 font-semibold text-gray-300 transition-colors hover:bg-white/10 disabled:opacity-50'
						>
							Отмена
						</button>
						<button
							type='submit'
							disabled={isSubmitting}
							className='flex-1 rounded-xl bg-white px-6 py-4 font-semibold text-black transition-colors hover:bg-white/90 disabled:opacity-50'
						>
							{isSubmitting ? (
								<>
									<Loader2 className='mr-2 inline h-5 w-5 animate-spin' />
									Сохранение...
								</>
							) : (
								'Сохранить изменения'
							)}
						</button>
					</div>
				</form>
			</div>
		</m.div>
	)
}
