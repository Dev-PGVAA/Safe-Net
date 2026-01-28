'use client'

import LessonEditor from '@/components/admin/learning/lessons/lesson-editor'
import CreateTaskDialog from '@/components/admin/learning/lessons/task-form-dialog'
import TasksList from '@/components/admin/learning/lessons/tasks-list'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/config/pages-url.config'
import { adminService } from '@/services/admin/admin.service'
import { useQuery } from '@tanstack/react-query'
import { AnimatePresence, m } from 'framer-motion'
import {
	ArrowLeft,
	BookOpen,
	CheckCircle2,
	Clock,
	FileText,
	Layers,
	Plus,
	Sparkles,
	Target,
	Zap,
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useMemo, useState } from 'react'

export default function LessonEditPage() {
	const params = useParams()
	const lessonId = params.id as string
	const [showCreateTask, setShowCreateTask] = useState(false)

	const {
		data: lesson,
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ['lesson', lessonId],
		queryFn: () => adminService.getLesson(lessonId),
	})

	const stats = useMemo(() => {
		const blocksCount = lesson?.blocks?.length ?? 0
		const tasksCount = lesson?.tasks?.length ?? 0
		const totalPoints =
			lesson?.tasks?.reduce((sum, task) => sum + (task.points || 0), 0) ?? 0
		const isComplete = blocksCount > 0 && tasksCount > 0
		return { blocksCount, tasksCount, totalPoints, isComplete }
	}, [lesson?.blocks, lesson?.tasks])

	if (isLoading) {
		return (
			<div className='flex h-screen items-center justify-center'>
				<div className='flex flex-col items-center gap-4'>
					<m.div
						animate={{ rotate: 360 }}
						transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
						className='relative h-16 w-16'
					>
						<div className='absolute inset-0 rounded-full border-4 border-white/10' />
						<div className='absolute inset-0 rounded-full border-4 border-transparent border-t-white' />
					</m.div>
					<p className='text-sm font-medium text-gray-400'>Загрузка урока...</p>
				</div>
			</div>
		)
	}

	if (!lesson) {
		return (
			<div className='flex h-screen items-center justify-center'>
				<div className='text-center'>
					<div className='mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10'>
						<BookOpen className='h-10 w-10 text-red-400' />
					</div>
					<h2 className='text-2xl font-bold text-white'>Урок не найден</h2>
					<p className='mt-2 text-gray-500'>
						Возможно, он был удален или не существует
					</p>
					<Link
						href={ROUTES.ADMIN.LEARNING.COURSES}
						className='mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-black transition-all hover:scale-105'
					>
						<ArrowLeft className='h-4 w-4' />
						Вернуться к курсам
					</Link>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen'>
			<div className='relative mx-auto max-w-7xl px-6 py-8'>
				{/* Breadcrumb Navigation */}
				<div className='mb-6'>
					<Breadcrumb
						showBackButton
						items={[
							{
								label: 'Обучение',
								href: ROUTES.ADMIN.LEARNING.COURSES,
							},
							{
								label: 'Курсы',
								href: ROUTES.ADMIN.LEARNING.COURSES,
							},
							{
								label: lesson.title,
								href: '#',
							},
						]}
					/>
				</div>

				{/* Header Section */}
				<m.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
					className='mb-10'
				>
					{/* Title and Badge */}
					<div className='mb-6 flex flex-wrap items-start justify-between gap-4'>
						<div className='flex-1'>
							<div className='mb-3 flex items-center gap-3'>
								<div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30'>
									<span className='text-lg font-bold text-white'>
										{lesson.order}
									</span>
								</div>
								<div>
									<div className='flex items-center gap-2'>
										<span className='text-sm font-semibold text-gray-500'>
											Урок {lesson.order}
										</span>
										{stats.isComplete && (
											<div className='flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-400'>
												<CheckCircle2 className='h-3 w-3' />
												Готов
											</div>
										)}
									</div>
								</div>
							</div>
							<h1 className='mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-5xl font-bold tracking-tight text-transparent'>
								{lesson.title}
							</h1>
						</div>
					</div>

					{/* Stats Grid - 4 columns */}
					<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
						{/* Duration */}
						<m.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.3 }}
							whileHover={{ y: -2 }}
							className='group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-6 backdrop-blur-xl transition-all hover:border-blue-500/30'
						>
							<div className='relative'>
								<div className='mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10'>
									<Clock className='h-6 w-6 text-blue-400' />
								</div>
								<p className='text-3xl font-bold text-white'>
									{lesson.estimatedDuration || 0}
									<span className='ml-1 text-lg text-gray-500'>мин</span>
								</p>
								<p className='mt-1 text-sm font-medium text-gray-500'>
									Длительность
								</p>
							</div>
						</m.div>

						{/* Blocks */}
						<m.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.3, delay: 0.05 }}
							whileHover={{ y: -2 }}
							className='group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-6 backdrop-blur-xl transition-all hover:border-purple-500/30'
						>
							<div className='relative'>
								<div className='mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10'>
									<FileText className='h-6 w-6 text-purple-400' />
								</div>
								<p className='text-3xl font-bold text-white'>
									{stats.blocksCount}
								</p>
								<p className='mt-1 text-sm font-medium text-gray-500'>
									Блоки теории
								</p>
							</div>
						</m.div>

						{/* Tasks */}
						<m.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.3, delay: 0.1 }}
							whileHover={{ y: -2 }}
							className='group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-6 backdrop-blur-xl transition-all hover:border-green-500/30'
						>
							<div className='relative'>
								<div className='mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10'>
									<Target className='h-6 w-6 text-green-400' />
								</div>
								<p className='text-3xl font-bold text-white'>
									{stats.tasksCount}
								</p>
								<p className='mt-1 text-sm font-medium text-gray-500'>
									Практика
								</p>
							</div>
						</m.div>

						{/* Points */}
						<m.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.3, delay: 0.15 }}
							whileHover={{ y: -2 }}
							className='group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-6 backdrop-blur-xl transition-all hover:border-yellow-500/30'
						>
							<div className='relative'>
								<div className='mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/10'>
									<Zap className='h-6 w-6 text-yellow-400' />
								</div>
								<p className='text-3xl font-bold text-white'>
									{stats.totalPoints}
									<span className='ml-1 text-lg text-gray-500'>XP</span>
								</p>
								<p className='mt-1 text-sm font-medium text-gray-500'>
									Всего баллов
								</p>
							</div>
						</m.div>
					</div>
				</m.div>

				{/* Main Content Grid */}
				<div className='grid gap-6 lg:grid-cols-2'>
					{/* Left Column - Lesson Editor */}
					<m.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.3, delay: 0.2 }}
						className='space-y-6'
					>
						{/* Section Header */}
						<div className='flex items-center gap-3'>
							<div className='flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10'>
								<Layers className='h-4 w-4 text-purple-400' />
							</div>
							<h2 className='text-2xl font-bold text-white'>
								Теоретический контент
							</h2>
						</div>

						{/* Editor Card */}
						<div className='overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur-xl'>
							<LessonEditor lesson={lesson} onSuccess={refetch} />
						</div>
					</m.div>

					{/* Right Column - Tasks */}
					<m.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.3, delay: 0.25 }}
						className='space-y-6'
					>
						{/* Section Header with Action Button */}
						<div className='flex items-center justify-between'>
							<div className='flex items-center gap-3'>
								<div className='flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10'>
									<Target className='h-4 w-4 text-green-400' />
								</div>
								<div>
									<h2 className='text-2xl font-bold text-white'>
										Практические задания
									</h2>
									<p className='text-sm text-gray-500'>
										{stats.tasksCount === 0
											? 'Добавьте первое задание'
											: `${stats.tasksCount} ${stats.tasksCount === 1 ? 'задание' : 'заданий'} • ${stats.totalPoints} XP`}
									</p>
								</div>
							</div>
							<m.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
								<Button
									onClick={() => setShowCreateTask(true)}
									className='group flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 font-semibold text-black shadow-lg shadow-white/10 transition-all hover:bg-white/90 hover:shadow-white/20'
								>
									<Plus className='h-4 w-4 transition-transform group-hover:rotate-90' />
									<span>Добавить</span>
								</Button>
							</m.div>
						</div>

						{/* Tasks Card */}
						<div className='overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur-xl'>
							<TasksList lesson={lesson} onRefetch={refetch} />
						</div>

						{/* Quick Stats */}
						{stats.tasksCount > 0 && (
							<m.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3, delay: 0.3 }}
								className='rounded-2xl border border-white/[0.08] bg-gradient-to-br from-blue-500/5 to-purple-500/5 p-6 backdrop-blur-xl'
							>
								<div className='mb-3 flex items-center gap-2'>
									<Sparkles className='h-5 w-5 text-blue-400' />
									<h3 className='font-semibold text-white'>Прогресс урока</h3>
								</div>
								<div className='space-y-3'>
									<div className='flex items-center justify-between text-sm'>
										<span className='text-gray-400'>Теория</span>
										<span className='font-semibold text-white'>
											{stats.blocksCount > 0 ? '✓ Готово' : '○ Не готово'}
										</span>
									</div>
									<div className='flex items-center justify-between text-sm'>
										<span className='text-gray-400'>Практика</span>
										<span className='font-semibold text-white'>
											{stats.tasksCount > 0 ? '✓ Готово' : '○ Не готово'}
										</span>
									</div>
									<div className='h-2 overflow-hidden rounded-full bg-white/10'>
										<m.div
											initial={{ width: 0 }}
											animate={{
												width: `${stats.isComplete ? 100 : stats.blocksCount > 0 ? 50 : 0}%`,
											}}
											transition={{ duration: 0.5 }}
											className='h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600'
										/>
									</div>
								</div>
							</m.div>
						)}
					</m.div>
				</div>
			</div>

			{/* Dialogs */}
			<AnimatePresence>
				{showCreateTask && (
					<CreateTaskDialog
						open={showCreateTask}
						onOpenChange={setShowCreateTask}
						lessonId={lessonId}
						onSuccess={refetch}
					/>
				)}
			</AnimatePresence>
		</div>
	)
}
