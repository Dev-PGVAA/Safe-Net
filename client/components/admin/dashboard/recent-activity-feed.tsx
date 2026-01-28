'use client'

import { ActivityType } from '@/services/admin/admin.types'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'
import { AnimatePresence, m } from 'framer-motion'
import {
    Award,
    BookOpen,
    CheckCircle2,
    Clock,
    FileText,
    Trophy,
    UserPlus,
} from 'lucide-react'

interface Activity {
	id: string
	type: ActivityType
	userName: string
	userEmail: string
	description: string
	timestamp: string
	metadata?: Record<string, any>
}

interface RecentActivityFeedProps {
	activities: Activity[]
}

const activityConfig = {
	USER_REGISTERED: {
		icon: UserPlus,
		color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
		label: 'Регистрация',
	},
	COURSE_COMPLETED: {
		icon: CheckCircle2,
		color:
			'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
		label: 'Курс завершен',
	},
	LESSON_COMPLETED: {
		icon: BookOpen,
		color:
			'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
		label: 'Урок завершен',
	},
	TEST_PASSED: {
		icon: FileText,
		color:
			'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
		label: 'Тест пройден',
	},
	CERTIFICATE_ISSUED: {
		icon: Award,
		color:
			'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
		label: 'Сертификат выдан',
	},
	ACHIEVEMENT_UNLOCKED: {
		icon: Trophy,
		color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
		label: 'Достижение разблокировано',
	},
}

export default function RecentActivityFeed({
	activities,
}: RecentActivityFeedProps) {
	if (activities.length === 0) {
		return (
			<m.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 text-center'
			>
				<Clock className='w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-400 mb-3' />
				<p className='text-sm sm:text-base text-gray-600 dark:text-gray-400'>
					Пока нет активности на платформе
				</p>
			</m.div>
		)
	}

	return (
		<m.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			className='rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-xl'
		>
			{/* Header */}
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6'>
				<div>
					<h3 className='text-lg sm:text-xl font-semibold text-gray-900 dark:text-white'>
						Последняя активность
					</h3>
					<p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1'>
						Последние {activities.length} событий на платформе
					</p>
				</div>
			</div>

			{/* Activity List */}
			<div className='space-y-2 sm:space-y-3 max-h-[400px] sm:max-h-[500px] overflow-y-auto pr-1 sm:pr-2'>
				<AnimatePresence mode='popLayout'>
					{activities.map((activity, index) => {
						const config =
							activityConfig[activity.type as keyof typeof activityConfig]
						const Icon = config?.icon || Activity

						return (
							<m.div
								key={activity.id}
								initial={{ opacity: 0, x: -20, y: 10 }}
								animate={{ opacity: 1, x: 0, y: 0 }}
								exit={{ opacity: 0, x: -20, y: 10 }}
								whileHover={{ x: 4, backgroundColor: 'rgba(0,0,0,0.2)' }}
								className='flex items-start gap-2 sm:gap-4 p-3 sm:p-4 rounded-xl  hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group h-[100px] sm:h-[110px] overflow-hidden'
							>
								{/* Icon */}
								<div
									className={`p-2 sm:p-3 rounded-xl shrink-0 ${config?.color || 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
								>
									<Icon className='w-4 h-4 sm:w-5 sm:h-5' />
								</div>

								{/* Content */}
								<div className='flex-1 min-w-0 flex flex-col h-full'>
									<div className='flex items-start justify-between gap-2 flex-1'>
										<div className='min-w-0 flex-1'>
											{/* User Name */}
											<p className='font-medium text-sm sm:text-base text-gray-900 dark:text-white truncate'>
												{activity.userName}
											</p>

											{/* Description */}
											<p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-2'>
												{activity.description}
											</p>

											{/* Email */}
											<p className='text-xs text-gray-500 dark:text-gray-500 mt-1 truncate'>
												{activity.userEmail}
											</p>
										</div>

										{/* Time - Hidden on mobile */}
										<m.div
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											className='text-right shrink-0 hidden sm:block'
										>
											<p className='text-xs font-medium text-gray-500 dark:text-gray-500 whitespace-nowrap'>
												{formatDistanceToNow(new Date(activity.timestamp), {
													addSuffix: false,
													locale: ru,
												})}
											</p>
											<p className='text-xs text-gray-400 dark:text-gray-600'>
												назад
											</p>
										</m.div>
									</div>

									{/* Metadata */}
									{activity.metadata && (
										<div className='mt-1 pt-1 border-t border-gray-200 dark:border-gray-700'>
											{activity.metadata.score && (
												<p className='text-xs text-gray-600 dark:text-gray-400 truncate'>
													<span className='font-medium'>Балл:</span>{' '}
													{activity.metadata.score}%
												</p>
											)}
											{activity.metadata.courseTitle && (
												<p className='text-xs text-gray-600 dark:text-gray-400 truncate'>
													<span className='font-medium'>Курс:</span>{' '}
													{activity.metadata.courseTitle}
												</p>
											)}
										</div>
									)}
								</div>

								{/* Badge */}
								<m.div
									whileHover={{ scale: 1.05 }}
									className='shrink-0 px-2 sm:px-2.5 py-1 rounded-full bg-linear-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 self-start'
								>
									<p className='text-xs font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap'>
										{config?.label || 'Событие'}
									</p>
								</m.div>
							</m.div>
						)
					})}
				</AnimatePresence>
			</div>
		</m.div>
	)
}
