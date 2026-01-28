'use client'

import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'
import { m } from 'framer-motion'
import { TrendingUp } from 'lucide-react'
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'

interface RegistrationsChartProps {
	data: { date: string; count: number }[]
	stats: {
		today: number
		week: number
		month: number
	}
}

export default function RegistrationsChart({
	data,
	stats,
}: RegistrationsChartProps) {
	const formattedData = data.map(item => ({
		...item,
		date: format(parseISO(item.date), 'd MMM', { locale: ru }),
	}))

	const maxValue = Math.max(...data.map(d => d.count), 1)

	return (
		<m.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-shadow'
		>
			{/* Header */}
			<div className='flex items-start justify-between mb-6'>
				<div>
					<div className='flex items-center gap-2 mb-2'>
						<div className='p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30'>
							<TrendingUp className='w-5 h-5 text-blue-600 dark:text-blue-400' />
						</div>
						<h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
							Регистрации пользователей
						</h3>
					</div>
					<p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
						Динамика за последние 30 дней
					</p>
				</div>

				{/* Stats */}
				<div className='text-right'>
					<div className='inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800'>
						<div>
							<p className='text-xs text-gray-600 dark:text-gray-400'>
								Сегодня
							</p>
							<p className='text-lg font-bold text-gray-900 dark:text-white'>
								{stats.today}
							</p>
						</div>
						<div className='w-px h-12 bg-gray-300 dark:bg-gray-700' />
						<div>
							<p className='text-xs text-gray-600 dark:text-gray-400'>
								За неделю
							</p>
							<p className='text-lg font-bold text-blue-600 dark:text-blue-400'>
								{stats.week}
							</p>
						</div>
						<div className='w-px h-12 bg-gray-300 dark:bg-gray-700' />
						<div>
							<p className='text-xs text-gray-600 dark:text-gray-400'>
								За месяц
							</p>
							<p className='text-lg font-bold text-purple-600 dark:text-purple-400'>
								{stats.month}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Chart */}
			<m.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.2 }}
			>
				<ResponsiveContainer width='100%' height={300}>
					<AreaChart data={formattedData}>
						<defs>
							<linearGradient
								id='colorRegistrations'
								x1='0'
								y1='0'
								x2='0'
								y2='1'
							>
								<stop offset='5%' stopColor='#3b82f6' stopOpacity={0.3} />
								<stop offset='95%' stopColor='#3b82f6' stopOpacity={0} />
							</linearGradient>
						</defs>
						<CartesianGrid
							strokeDasharray='3 3'
							stroke='#e5e7eb'
							className='dark:stroke-gray-800'
							vertical={false}
						/>
						<XAxis
							dataKey='date'
							stroke='#9ca3af'
							fontSize={12}
							style={{ fontFamily: 'inherit' }}
						/>
						<YAxis
							stroke='#9ca3af'
							fontSize={12}
							style={{ fontFamily: 'inherit' }}
							domain={[0, Math.ceil(maxValue * 1.1)]}
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: 'rgba(17, 24, 39, 0.95)',
								border: 'none',
								borderRadius: '12px',
								color: '#fff',
							}}
							formatter={(value: number) => [`${value} чел.`, 'Регистрации']}
							labelStyle={{ color: '#fff' }}
						/>
						<Area
							type='monotone'
							dataKey='count'
							stroke='#3b82f6'
							strokeWidth={2}
							fill='url(#colorRegistrations)'
							dot={false}
							animationDuration={1000}
						/>
					</AreaChart>
				</ResponsiveContainer>
			</m.div>

			{/* Footer */}
			<div className='mt-4 pt-4 border-t border-gray-200 dark:border-gray-800'>
				<p className='text-xs text-gray-500 dark:text-gray-500 text-center'>
					Обновлено автоматически каждые 30 секунд
				</p>
			</div>
		</m.div>
	)
}
