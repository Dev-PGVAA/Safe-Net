'use client'

import { m } from 'framer-motion'
import { TrendingUp } from 'lucide-react'
import {
	Area,
	AreaChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'

interface UserGrowthData {
	period: string
	total: number
	active: number
	new: number
}

interface UserGrowthChartProps {
	data: UserGrowthData[]
}

export default function UserGrowthChart({ data }: UserGrowthChartProps) {
	if (!data || data.length === 0) {
		return (
			<m.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6'
			>
				<p className='text-center text-gray-500 dark:text-gray-400 py-8'>
					No data to display
				</p>
			</m.div>
		)
	}

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
						<div className='p-2 rounded-lg bg-green-100 dark:bg-green-900/30'>
							<TrendingUp className='w-5 h-5 text-green-600 dark:text-green-400' />
						</div>
						<h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
							User growth
						</h3>
					</div>
					<p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
						Trend over the last 6 months
					</p>
				</div>
			</div>

			{/* Chart */}
			<m.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.2 }}
			>
				<ResponsiveContainer width='100%' height={300}>
					<AreaChart data={data}>
						<defs>
							<linearGradient id='colorTotal' x1='0' y1='0' x2='0' y2='1'>
								<stop offset='5%' stopColor='#3b82f6' stopOpacity={0.3} />
								<stop offset='95%' stopColor='#3b82f6' stopOpacity={0} />
							</linearGradient>
							<linearGradient id='colorActive' x1='0' y1='0' x2='0' y2='1'>
								<stop offset='5%' stopColor='#10b981' stopOpacity={0.3} />
								<stop offset='95%' stopColor='#10b981' stopOpacity={0} />
							</linearGradient>
						</defs>
						<CartesianGrid
							strokeDasharray='3 3'
							stroke='#e5e7eb'
							className='dark:stroke-gray-800'
							vertical={false}
						/>
						<XAxis
							dataKey='period'
							stroke='#9ca3af'
							fontSize={12}
							style={{ fontFamily: 'inherit' }}
						/>
						<YAxis
							stroke='#9ca3af'
							fontSize={12}
							style={{ fontFamily: 'inherit' }}
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: 'rgba(17, 24, 39, 0.95)',
								border: 'none',
								borderRadius: '12px',
								color: '#fff',
							}}
							formatter={(value: number, name: string) => {
								if (name === 'total') return [`${value}`, 'Total']
								if (name === 'active') return [`${value}`, 'Active']
								if (name === 'new') return [`${value}`, 'New']
								return [value, name]
							}}
							labelStyle={{ color: '#fff' }}
						/>
						<Legend wrapperStyle={{ paddingTop: '20px' }} iconType='line' />
						<Area
							type='monotone'
							dataKey='total'
							stroke='#3b82f6'
							fill='url(#colorTotal)'
							name='Total'
							strokeWidth={2}
							animationDuration={800}
						/>
						<Area
							type='monotone'
							dataKey='active'
							stroke='#10b981'
							fill='url(#colorActive)'
							name='Active'
							strokeWidth={2}
							animationDuration={800}
						/>
					</AreaChart>
				</ResponsiveContainer>
			</m.div>

			{/* Stats Footer */}
			<div className='mt-6 pt-6 border-t border-gray-200 dark:border-gray-800'>
				<div className='grid grid-cols-3 gap-3'>
					{data.map((item, i) => (
						<m.div
							key={item.period}
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.05 * i }}
							className='p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition'
						>
							<p className='text-xs font-medium text-gray-600 dark:text-gray-400'>
								{item.period}
							</p>
							<div className='flex items-baseline gap-1 mt-1'>
								<p className='text-sm font-bold text-blue-600 dark:text-blue-400'>
									{item.total}
								</p>
								<p className='text-xs text-gray-500 dark:text-gray-500'>
									(+{item.new})
								</p>
							</div>
						</m.div>
					))}
				</div>
			</div>
		</m.div>
	)
}
