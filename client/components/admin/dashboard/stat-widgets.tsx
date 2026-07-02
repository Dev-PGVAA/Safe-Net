'use client'

import { IAdminStats } from '@/services/admin/admin.types'
import { m } from 'framer-motion'
import {
	Award,
	BookOpen,
	CheckCircle2,
	FileText,
	TrendingUp,
	Users,
} from 'lucide-react'

interface StatWidgetsProps {
	stats: IAdminStats
}

export default function StatWidgets({ stats }: StatWidgetsProps) {
	const widgets = [
		{
			title: 'Total users',
			value: stats.users?.total || 0,
			subtitle: `${stats.users?.active || 0} active`,
			icon: Users,
			color: 'from-blue-500 to-blue-600',
			change: stats.registrations?.week || 0,
			changeLabel: 'this week',
		},
		{
			title: 'Courses',
			value: stats.content?.courses || 0,
			subtitle: `${stats.content?.lessons || 0} lessons`,
			icon: BookOpen,
			color: 'from-purple-500 to-purple-600',
		},
		{
			title: 'Answer success rate',
			value: `${stats.performance?.averageCorrectPercent || 0}%`,
			subtitle: `${stats.performance?.correctAttempts || 0}/${stats.performance?.totalAttempts || 0}`,
			icon: CheckCircle2,
			color: 'from-green-500 to-green-600',
		},
		{
			title: 'Certificates issued',
			value: stats.performance?.certificates || 0,
			subtitle: 'Total',
			icon: Award,
			color: 'from-orange-500 to-orange-600',
		},
		{
			title: 'Practical tasks',
			value: stats.content?.tasks || 0,
			subtitle: `${stats.content?.tests || 0} tests`,
			icon: FileText,
			color: 'from-pink-500 to-pink-600',
		},
		{
			title: 'Update ticks',
			value: stats.performance?.totalAttempts || 0,
			subtitle: 'Attempts made',
			icon: TrendingUp,
			color: 'from-cyan-500 to-cyan-600',
		},
	]

	return (
		<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
			{widgets.map((widget, i) => {
				const Icon = widget.icon
				return (
					<m.div
						key={widget.title}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: i * 0.05 }}
						whileHover={{ scale: 1.02 }}
						className={`relative overflow-hidden rounded-2xl bg-linear-to-br ${widget.color} p-6 text-white shadow-lg hover:shadow-xl transition-shadow cursor-default group`}
					>
						{/* Background Pattern */}
						<div className='absolute top-0 right-0 -mt-12 -mr-12 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform' />
						<div className='absolute bottom-0 left-0 -mb-12 -ml-12 w-32 h-32 bg-black/10 rounded-full blur-2xl' />

						{/* Content */}
						<div className='relative z-10'>
							<div className='flex items-start justify-between mb-4'>
								<div>
									<p className='text-sm font-medium text-white/80 mb-1'>
										{widget.title}
									</p>
									<div className='flex items-baseline gap-2'>
										<p className='text-3xl font-bold'>
											{typeof widget.value === 'number'
												? widget.value.toLocaleString('ru-RU')
												: widget.value}
										</p>
										{widget.change !== undefined && (
											<m.span
												initial={{ scale: 0 }}
												animate={{ scale: 1 }}
												className='text-sm font-semibold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm'
											>
												+{widget.change}
											</m.span>
										)}
									</div>
								</div>
								<div className='p-3 rounded-xl bg-white/20 backdrop-blur-sm'>
									<Icon className='w-6 h-6 text-white/90' />
								</div>
							</div>

							{/* Subtitle */}
							<p className='text-sm text-white/70'>
								{widget.subtitle}
								{widget.changeLabel && ` (${widget.changeLabel})`}
							</p>

							{/* Progress Bar */}
							{typeof widget.value === 'string' &&
								widget.value.includes('%') && (
									<div className='mt-4 w-full h-2 bg-white/20 rounded-full overflow-hidden'>
										<m.div
											initial={{ width: 0 }}
											animate={{
												width: `${parseInt(widget.value)}%`,
											}}
											transition={{ duration: 1, delay: 0.3 }}
											className='h-full bg-white/60 rounded-full'
										/>
									</div>
								)}
						</div>
					</m.div>
				)
			})}
		</div>
	)
}
