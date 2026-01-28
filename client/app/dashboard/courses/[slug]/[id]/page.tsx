'use client'

import { Badge } from '@/components/ui/badge'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { ROUTES } from '@/config/pages-url.config'
import { useCourseDetail } from '@/hooks/learning/useCourseDetail'
import { useLessonDetail } from '@/hooks/learning/useLessonDetail'
import { cn } from '@/lib/utils'
import { m } from 'framer-motion'
import {
	ArrowLeft,
	BookOpen,
	CheckCircle2,
	Clock,
	Sparkles,
	Target,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Suspense, useMemo } from 'react'
import { AppleLessonDetail } from './AppleLessonDetail'

export default function LessonDetailPage() {
	const router = useRouter()
	const { course } = useCourseDetail()
	const { lesson, isLoading, answerTask, isAnswering } = useLessonDetail()

	const stats = useMemo(() => {
		if (!lesson?.tasks)
			return {
				completedTasks: 0,
				startedTasks: 0,
				totalTasks: 0,
				progress: 0,
			}

		const completedTasks = lesson.tasks.filter((t: any) => t.completed).length
		const startedTasks = lesson.tasks.filter(
			(t: any) => t.started && !t.completed
		).length
		const totalTasks = lesson.tasks.length

		// Прогресс: завершенные задачи + 50% за начатые
		const weightedProgress =
			totalTasks > 0
				? ((completedTasks + startedTasks * 0.5) / totalTasks) * 100
				: 0

		return {
			completedTasks,
			startedTasks,
			totalTasks,
			progress: Math.round(weightedProgress),
		}
	}, [lesson?.tasks])

	// Форматирование длительности урока
	const formatDuration = (minutes?: number) => {
		if (!minutes) return '15–20 мин'

		if (minutes < 60) return `${minutes} мин`

		const hours = Math.floor(minutes / 60)
		const mins = minutes % 60
		return `${hours} ч${mins > 0 ? ` ${mins} мин` : ''}`
	}

	if (isLoading) {
		return (
			<>
				<div className='fixed inset-0 pointer-events-none overflow-hidden -z-10'>
					<div className='absolute top-10 sm:top-20 left-5 sm:left-10 w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-white/3 rounded-full blur-[60px] sm:blur-[80px]' />
					<div
						className='absolute top-1/2 right-10 sm:right-20 w-[150px] sm:w-[250px] h-[150px] sm:h-[250px] bg-indigo-500/4 rounded-full blur-2xl sm:blur-[60px] animate-pulse'
						style={{ animationDuration: '12s' }}
					/>
				</div>
				<div className='space-y-6 sm:space-y-8'>
					<Skeleton className='h-8 sm:h-10 w-48 sm:w-64 rounded-xl bg-white/5' />
					<Skeleton className='h-64 sm:h-72 w-full rounded-2xl sm:rounded-3xl bg-white/5' />
					<div className='grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6'>
						<div className='lg:col-span-2 space-y-4'>
							<Skeleton className='h-96 rounded-2xl sm:rounded-3xl bg-white/5' />
						</div>
						<div className='space-y-4'>
							<Skeleton className='h-48 rounded-2xl sm:rounded-3xl bg-white/5' />
							<Skeleton className='h-32 rounded-2xl sm:rounded-3xl bg-white/5' />
						</div>
					</div>
				</div>
			</>
		)
	}

	if (!lesson) {
		return (
			<>
				<div className='fixed inset-0 pointer-events-none overflow-hidden -z-10'>
					<div className='absolute top-10 sm:top-20 left-5 sm:left-10 w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-white/3 rounded-full blur-[60px] sm:blur-[80px]' />
					<div
						className='absolute top-1/2 right-10 sm:right-20 w-[150px] sm:w-[250px] h-[150px] sm:h-[250px] bg-indigo-500/4 rounded-full blur-2xl sm:blur-[60px] animate-pulse'
						style={{ animationDuration: '12s' }}
					/>
				</div>
				<div className='min-h-screen flex items-center justify-center p-4'>
					<m.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.3 }}
					>
						<Card className='w-full max-w-lg bg-white/3 backdrop-blur-2xl border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl p-8 sm:p-12 text-center'>
							<div className='w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-5 sm:mb-6 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center border border-white/20 shadow-lg'>
								<BookOpen className='w-8 h-8 sm:w-10 sm:h-10 text-white/20' />
							</div>
							<h2 className='text-2xl sm:text-3xl font-black text-white mb-2 sm:mb-3'>
								Урок не найден
							</h2>
							<p className='text-base sm:text-lg text-white/60 mb-6 sm:mb-8 leading-relaxed'>
								Проверьте ссылку или обратитесь к администратору.
							</p>
							<Button
								onClick={() => router.back()}
								className='w-full h-11 sm:h-12 rounded-xl sm:rounded-2xl bg-white text-black hover:bg-white/80 shadow-2xl font-bold text-sm sm:text-base'
							>
								<ArrowLeft className='mr-2 h-4 w-4' />
								Вернуться назад
							</Button>
						</Card>
					</m.div>
				</div>
			</>
		)
	}

	return (
		<>
			<div className='fixed inset-0 pointer-events-none overflow-hidden -z-10'>
				<div className='absolute top-10 sm:top-20 left-5 sm:left-10 w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-white/3 rounded-full blur-[60px] sm:blur-[80px]' />
				<div
					className='absolute top-1/2 right-10 sm:right-20 w-[150px] sm:w-[250px] h-[150px] sm:h-[250px] bg-indigo-500/4 rounded-full blur-2xl sm:blur-[60px] animate-pulse'
					style={{ animationDuration: '12s' }}
				/>
			</div>

			<div className='space-y-6 sm:space-y-8'>
				<Breadcrumb
					showBackButton
					items={[
						{ label: 'Обучение', href: ROUTES.COURSES, icon: BookOpen },
						{
							label: lesson.courseTitle,
							href: `${ROUTES.COURSES}/${lesson.courseSlug}`,
						},
						{ label: lesson.title },
					]}
				/>

				{/* Hero Card */}
				<m.section
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					className='relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white/3 backdrop-blur-2xl border border-white/5 shadow-2xl p-5 sm:p-6 md:p-8 lg:p-10'
				>
					<div className='absolute inset-0 bg-linear-to-r from-white/2 via-transparent to-white/2' />
					<div className='relative z-10 space-y-5 sm:space-y-6'>
						<div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5'>
							<div className='space-y-4 flex-1'>
								<div className='flex flex-wrap items-center gap-2'>
									<Badge className='bg-white/10 backdrop-blur-sm border-white/20 text-white/80 px-3 sm:px-4 py-1 sm:py-1.5 rounded-xl text-xs sm:text-sm'>
										<Target className='h-3 w-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 opacity-80' />
										Урок {lesson.order}
									</Badge>

									{stats.progress === 100 && (
										<Badge className='bg-emerald-500/10 border-emerald-500/20 text-emerald-400 px-3 sm:px-4 py-1 sm:py-1.5 rounded-xl text-xs sm:text-sm backdrop-blur-sm'>
											<CheckCircle2 className='h-3 w-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2' />
											Завершено
										</Badge>
									)}

									{stats.startedTasks > 0 && stats.progress < 100 && (
										<Badge className='bg-yellow-500/10 border-yellow-500/20 text-yellow-400 px-3 sm:px-4 py-1 sm:py-1.5 rounded-xl text-xs sm:text-sm backdrop-blur-sm'>
											<Clock className='h-3 w-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2' />
											В процессе
										</Badge>
									)}
								</div>

								<div className='space-y-2'>
									<h1 className='text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight'>
										{lesson.title}
									</h1>
								</div>

								<div className='flex flex-wrap items-center gap-3 sm:gap-4 pt-2 text-xs sm:text-sm text-white/60'>
									<div className='flex items-center gap-1.5 sm:gap-2'>
										<Clock className='h-4 w-4 opacity-70' />
										<span>{formatDuration(lesson.estimatedDuration) || 0}</span>
									</div>
									<div className='flex items-center gap-1.5 sm:gap-2'>
										<BookOpen className='h-4 w-4 opacity-70' />
										<span>
											{lesson.blocks?.length || 0} блока теории •{' '}
											{stats.totalTasks > 0
												? `${stats.completedTasks}/${stats.totalTasks} задач`
												: 'Заданий пока нет'}
										</span>
									</div>
								</div>
							</div>
						</div>

						{stats.totalTasks > 0 && (
							<div className='space-y-2.5 sm:space-y-3 pt-4'>
								<div className='flex items-center justify-between text-xs sm:text-sm'>
									<span className='text-white/60 font-medium'>
										Общий прогресс
										{stats.startedTasks > 0 && (
											<span className='ml-2 text-xs text-yellow-400'>
												({stats.startedTasks} в процессе)
											</span>
										)}
									</span>
									<span className='text-white font-bold'>
										{stats.progress}%
									</span>
								</div>
								<Progress
									value={stats.progress}
									className='h-2 sm:h-2.5 bg-white/5 border border-white/10 rounded-full [&>div]:bg-linear-to-r [&>div]:from-blue-500 [&>div]:to-purple-500 [&>div]:shadow-lg'
								/>
							</div>
						)}
					</div>
				</m.section>

				{/* Content Grid */}
				<m.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, delay: 0.1 }}
					className='grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 items-start'
				>
					{/* Main Content */}
					<div className='lg:col-span-2 space-y-5'>
						<Suspense
							fallback={
								<Card className='bg-white/3 backdrop-blur-2xl border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl'>
									<CardContent className='p-8 sm:p-10'>
										<div className='flex flex-col items-center justify-center text-center space-y-4'>
											<m.div
												initial={{ scale: 0 }}
												animate={{ scale: 1 }}
												className='w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-xl'
											>
												<Sparkles className='w-6 h-6 sm:w-8 sm:h-8 text-white' />
											</m.div>
											<div className='space-y-2'>
												<p className='text-base sm:text-lg font-black text-white'>
													Подготовка материалов урока
												</p>
												<p className='text-xs sm:text-sm text-white/60 leading-relaxed'>
													Это займет всего несколько секунд...
												</p>
											</div>
										</div>
									</CardContent>
								</Card>
							}
						>
							<AppleLessonDetail
								lesson={lesson}
								answerTask={answerTask}
								isAnswering={isAnswering}
							/>
						</Suspense>
					</div>

					{/* Sidebar */}
					<div className='space-y-5 sm:space-y-6 lg:sticky lg:top-6'>
						<Card className='bg-white/3 backdrop-blur-2xl border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden'>
							<CardContent className='p-6 sm:p-8 space-y-5'>
								<div className='flex items-start gap-4'>
									<div className='w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-base sm:text-lg font-black shadow-xl'>
										{lesson.order}
									</div>
									<div className='flex-1 min-w-0'>
										<p className='text-xs font-bold text-white/50 uppercase tracking-wider mb-1'>
											Курс
										</p>
										<p className='text-sm sm:text-base font-black text-white truncate'>
											{lesson.courseTitle}
										</p>
									</div>
								</div>

								<div className='space-y-3 pt-3 border-t border-white/10 text-sm'>
									<div className='flex items-center justify-between'>
										<span className='text-white/60'>Теория</span>
										<span className='font-bold text-white'>
											{lesson.blocks?.length || 0} блоков
										</span>
									</div>
									<div className='flex items-center justify-between'>
										<span className='text-white/60'>Задачи</span>
										<span className='font-bold text-white'>
											{stats.totalTasks > 0
												? `${stats.completedTasks}/${stats.totalTasks}`
												: '0/0'}
										</span>
									</div>
									{stats.startedTasks > 0 && (
										<div className='flex items-center justify-between text-xs pt-2 border-t border-white/5'>
											<span className='text-yellow-400/60'>В работе</span>
											<span className='font-bold text-yellow-400'>
												{stats.startedTasks}{' '}
												{stats.startedTasks === 1
													? 'задача'
													: stats.startedTasks < 5
														? 'задачи'
														: 'задач'}
											</span>
										</div>
									)}
									<div className='flex items-center justify-between'>
										<span className='text-white/60'>Статус урока</span>
										<span
											className={cn(
												'font-bold',
												stats.progress === 100
													? 'text-emerald-400'
													: stats.progress > 0
														? 'text-yellow-400'
														: 'text-white'
											)}
										>
											{stats.progress === 100
												? 'Завершён'
												: stats.totalTasks === 0
													? 'Без заданий'
													: stats.progress > 0
														? 'В процессе'
														: 'Не начат'}
										</span>
									</div>
									<div className='flex items-center justify-between'>
										<span className='text-white/60'>Время</span>
										<span className='font-bold text-white'>
											{formatDuration(lesson.estimatedDuration)}
										</span>
									</div>
								</div>
							</CardContent>
						</Card>

						{stats.progress > 0 && stats.progress < 100 && (
							<m.div
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.3, delay: 0.2 }}
							>
								<Card className='bg-white/3 backdrop-blur-2xl border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl'>
									<CardContent className='p-6 sm:p-8 text-center space-y-3 sm:space-y-4'>
										<m.div
											initial={{ scale: 0 }}
											animate={{ scale: 1 }}
											className='w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-xl sm:rounded-2xl bg-linear-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center border border-yellow-500/20 backdrop-blur-sm shadow-lg'
										>
											<Sparkles className='w-6 h-6 sm:w-7 sm:h-7 text-yellow-400' />
										</m.div>
										<div>
											<p className='text-base sm:text-lg font-black text-white mb-1.5 sm:mb-2 leading-tight'>
												Продолжай в том же духе!
											</p>
											<p className='text-xs sm:text-sm text-white/60 leading-relaxed'>
												Ты уже прошёл {stats.completedTasks} из{' '}
												{stats.totalTasks} заданий
												{stats.startedTasks > 0 &&
													` (${stats.startedTasks} в процессе)`}
											</p>
										</div>
									</CardContent>
								</Card>
							</m.div>
						)}
					</div>
				</m.div>
			</div>
		</>
	)
}
