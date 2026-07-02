'use client'
import { ArrowUpRight, Award, BookOpen, Sparkles, Zap } from 'lucide-react'

import { ROUTES } from '@/config/pages-url.config'
import { useCourses } from '@/hooks/learning/useCourses'
import { useProfile } from '@/hooks/user/useProfile'
import { cn } from '@/lib/utils'
import { useEffect, useMemo, useState } from 'react'
import { AppleButton } from '../components/AppleButton'
import { AppleCourseCard } from '../components/AppleCourseCard'
import { AppleLoadingGrid } from '../components/AppleLoadingGrid'
import { AppleStatCard } from '../components/AppleStatCard'
import { EmptyState } from '../components/EmptyState'
import { TabButton } from '../components/TabButton'

export default function CoursesPage() {
	const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'all'>(
		'active'
	)
	const { user } = useProfile()
	const [mounted, setMounted] = useState(false)
	const [scrollY, setScrollY] = useState(0)

	useEffect(() => {
		setMounted(true)
		const handleScroll = () => {
			setScrollY(window.scrollY)
		}
		window.addEventListener('scroll', handleScroll, { passive: true })
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	const { courses: activeCourses, isLoading: isActiveLoading } =
		useCourses('active')
	const { courses: completedCourses, isLoading: isCompletedLoading } =
		useCourses('completed')

	const stats = useMemo(() => {
		const allCourses = [...activeCourses, ...completedCourses]
		return {
			totalCourses: allCourses.length,
			activeCount: activeCourses.length,
			completedCount: completedCourses.length,
			totalXP: allCourses.reduce((sum, c) => sum + (c.totalXp || 0), 0),
			allCourses,
		}
	}, [activeCourses, completedCourses])

	return (
		<>
			{/* Background */}
			<div className='fixed inset-0 overflow-hidden pointer-events-none -z-10'>
				<div
					className='absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl'
					style={{ transform: `translateY(${scrollY * 0.3}px)` }}
				/>
				<div
					className='absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl'
					style={{ transform: `translateY(${scrollY * 0.2}px)` }}
				/>
			</div>

			<div className='max-w-[1400px] mx-auto space-y-16'>
				{/* Header */}
				<div
					className={cn(
						'space-y-8 transition-all duration-1000',
						mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
					)}
				>
					{/* Title */}
					<div className='space-y-4'>
						<div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10'>
							<Sparkles className='w-4 h-4 text-blue-400' />
							<span className='text-sm font-medium text-slate-400'>
								{user?.name ? `Hi, ${user.name}` : 'Welcome'}
							</span>
						</div>
						<h1 className='text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-none'>
							My Courses
						</h1>
						<p className='text-xl md:text-2xl text-slate-400 max-w-2xl leading-relaxed'>
							Continue learning where you left off. Every step brings you
							closer to your goal.
						</p>
					</div>

					{/* Stats */}
					<div className='grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
						<AppleStatCard
							label='Active'
							value={stats.activeCount}
							icon={<BookOpen className='w-6 h-6' />}
							color='from-blue-500/20 to-cyan-500/20'
							iconColor='text-blue-400'
						/>
						<AppleStatCard
							label='Completed'
							value={stats.completedCount}
							icon={<Award className='w-6 h-6' />}
							color='from-emerald-500/20 to-teal-500/20'
							iconColor='text-emerald-400'
						/>
						<AppleStatCard
							label='Total XP'
							value={stats.totalXP.toLocaleString()}
							icon={<Zap className='w-6 h-6' />}
							color='from-amber-500/20 to-orange-500/20'
							iconColor='text-amber-400'
						/>
					</div>
				</div>

				{/* Tabs */}
				<div
					className={cn(
						'transition-all duration-1000 delay-150',
						mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
					)}
				>
					<div className='inline-flex items-center gap-2 p-1.5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10'>
						<TabButton
							active={activeTab === 'active'}
							onClick={() => setActiveTab('active')}
						>
							Active
							<span className='ml-2 text-xs opacity-60'>
								{stats.activeCount}
							</span>
						</TabButton>
						<TabButton
							active={activeTab === 'completed'}
							onClick={() => setActiveTab('completed')}
						>
							Completed
							<span className='ml-2 text-xs opacity-60'>
								{stats.completedCount}
							</span>
						</TabButton>
						<TabButton
							active={activeTab === 'all'}
							onClick={() => setActiveTab('all')}
						>
							All
							<span className='ml-2 text-xs opacity-60'>
								{stats.totalCourses}
							</span>
						</TabButton>
					</div>
				</div>

				{/* Courses Grid */}
				<div
					className={cn(
						'transition-all duration-1000 delay-300',
						mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
					)}
				>
					{/* Active Tab */}
					{activeTab === 'active' && (
						<>
							{isActiveLoading ? (
								<AppleLoadingGrid />
							) : activeCourses.length === 0 ? (
								<EmptyState
									icon={<BookOpen className='w-16 h-16' />}
									title='No active courses'
									description='Start learning with any course from the catalog'
									actionLabel='Open catalog'
									actionHref={ROUTES.COURSES}
								/>
							) : (
								<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
									{activeCourses.map((course, index) => (
										<AppleCourseCard
											key={course.id}
											course={course}
											index={index}
										/>
									))}
								</div>
							)}
						</>
					)}

					{/* Completed Tab */}
					{activeTab === 'completed' && (
						<>
							{isCompletedLoading ? (
								<AppleLoadingGrid />
							) : completedCourses.length === 0 ? (
								<EmptyState
									icon={<Award className='w-16 h-16' />}
									title='No completed courses yet'
									description='Complete your first course to earn a certificate'
									actionLabel='Open catalog'
									actionHref={ROUTES.COURSES}
								/>
							) : (
								<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
									{completedCourses.map((course, index) => (
										<AppleCourseCard
											key={course.id}
											course={course}
											index={index}
										/>
									))}
								</div>
							)}
						</>
					)}

					{/* All Tab */}
					{activeTab === 'all' && (
						<>
							{isActiveLoading || isCompletedLoading ? (
								<AppleLoadingGrid />
							) : stats.allCourses.length === 0 ? (
								<EmptyState
									icon={<BookOpen className='w-16 h-16' />}
									title='No courses'
									description='Start your learning journey right now'
									actionLabel='Select a course'
									actionHref={ROUTES.COURSES}
								/>
							) : (
								<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
									{stats.allCourses.map((course, index) => (
										<AppleCourseCard
											key={course.id}
											course={course}
											index={index}
										/>
									))}
								</div>
							)}
						</>
					)}
				</div>

				{/* CTA Section */}
				{stats.totalCourses > 0 && (
					<div
						className={cn(
							'pt-16 transition-all duration-1000 delay-500',
							mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
						)}
					>
						<div className='relative overflow-hidden rounded-3xl bg-linear-to-br from-white/5 to-white/2 backdrop-blur-2xl border border-white/10 p-8 md:p-12'>
							{/* Background elements */}
							<div className='absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl' />
							<div className='absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl' />

							<div className='relative z-10 space-y-6'>
								<div>
									<h3 className='text-2xl md:text-3xl font-bold mb-2'>
										Continue learning
									</h3>
									<p className='text-slate-400 text-lg'>
										Explore new topics and earn certificates
									</p>
								</div>
								<div className='flex flex-wrap gap-4'>
									<AppleButton href={ROUTES.COURSES} variant='primary'>
										Course catalog
										<ArrowUpRight className='w-4 h-4 ml-2' />
									</AppleButton>
									<AppleButton href={ROUTES.CERTIFICATES} variant='secondary'>
										Certificates
									</AppleButton>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	)
}
