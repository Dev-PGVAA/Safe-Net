'use client'

import { usePublicStats } from '@/hooks/public/usePublicStats'
import { animate, m, useInView, useMotionValue } from 'framer-motion'
import { BookOpen, CheckCircle, Target, Users } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { IStatItem } from './stats.interface'

function AnimatedNumber({
	value,
	suffix = '',
	duration = 1.5,
}: {
	value: number
	suffix?: string
	duration?: number
}) {
	const count = useMotionValue(0)
	const [display, setDisplay] = useState('0' + suffix)

	useEffect(() => {
		const unsubscribe = count.on('change', v => {
			const n = Math.floor(v)
			setDisplay(n.toLocaleString() + suffix)
		})
		const controls = animate(count, value, {
			duration,
			ease: [0.22, 1, 0.36, 1],
		})
		return () => {
			unsubscribe()
			controls.stop()
		}
	}, [count, value, suffix, duration])

	return <span>{display}</span>
}

function StatItem({ icon: Icon, label, value, suffix, index }: IStatItem) {
	const ref = useRef(null)
	const isInView = useInView(ref, { once: true, margin: '-20% 0px' })

	return (
		<m.div
			ref={ref}
			initial={{ opacity: 0, y: 40, scale: 0.8 }}
			whileInView={{ opacity: 1, y: 0, scale: 1 }}
			viewport={{ once: true }}
			transition={{
				duration: 0.6,
				delay: index * 0.15,
				ease: [0.25, 0.8, 0.25, 1],
			}}
			className='text-center'
		>
			<m.div
				whileHover={{ scale: 1.15, boxShadow: '0 0 15px #a78bfa' }}
				transition={{ type: 'spring', stiffness: 300 }}
				className='w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3'
			>
				<Icon className='w-6 h-6 text-white' />
			</m.div>
			<m.div
				initial={{ opacity: 0, y: 10 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.7, delay: 0.2 + index * 0.13 }}
				className='text-3xl font-bold text-white mb-1'
			>
				{isInView ? (
					<AnimatedNumber value={value} suffix={suffix} duration={1.6} />
				) : (
					<span>0{suffix}</span>
				)}
			</m.div>
			<div className='text-sm text-slate-400'>{label}</div>
		</m.div>
	)
}

export default function Stats() {
	const { stats, isLoading } = usePublicStats()

	// Mapping API data to stats
	const statsData = [
		{
			label: 'Active Users',
			value: stats?.totalUsers ?? 0,
			suffix: '+',
			icon: Users,
		},
		{
			label: 'Tasks Completed',
			value: stats?.totalTasks ?? 0,
			suffix: '+',
			icon: CheckCircle,
		},
		{
			label: 'Average Accuracy',
			value: stats?.averageAccuracy ?? 0,
			suffix: '%',
			icon: Target,
		},
		{
			label: 'Courses Available',
			value: stats?.totalLessons ?? 0,
			suffix: '+',
			icon: BookOpen,
		},
	]

	// Skeleton loader
	if (isLoading) {
		return (
			<section id='stats' className='py-16 bg-slate-800/30'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='grid grid-cols-2 lg:grid-cols-4 gap-6'>
						{[...Array(4)].map((_, i) => (
							<div key={i} className='text-center animate-pulse'>
								<div className='w-12 h-12 bg-slate-700 rounded-xl mx-auto mb-3' />
								<div className='h-8 w-24 bg-slate-700 rounded mx-auto mb-1' />
								<div className='h-4 w-32 bg-slate-700 rounded mx-auto' />
							</div>
						))}
					</div>
				</div>
			</section>
		)
	}

	return (
		<section id='stats' className='py-16 bg-slate-800/30'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='grid grid-cols-2 lg:grid-cols-4 gap-6'>
					{statsData.map((stat, i) => (
						<StatItem key={i} {...stat} index={i} />
					))}
				</div>
			</div>
		</section>
	)
}
