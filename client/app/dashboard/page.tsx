'use client'
import { BookOpen, Play, Trophy, Zap } from 'lucide-react'

import { ROUTES } from '@/config/pages-url.config'
import { useHomeData } from '@/hooks/learning/useHomeData'
import { useProfile } from '@/hooks/user/useProfile'
import { cn } from '@/lib/utils'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AchievementNotification } from './components/AchievementNotification'
import { AppleCourseCard } from './components/AppleCourseCard'
import { AppleStatCard } from './components/AppleStatCard'
import { EmptyState } from './components/EmptyState'
import { SectionHeader } from './components/SectionHeader'
import { ShimmerSkeleton } from './components/ShimmerSkeleton'
import { WelcomeCard } from './components/WelcomeCard'

export default function DashboardHome() {
	const { user } = useProfile()
	const { myCourses, completedCount, totalXp, isMyCoursesLoading } =
		useHomeData()
	const [mounted, setMounted] = useState(false)
	const [showAchievement, setShowAchievement] = useState(false)
	const rafRef = useRef<number>(0)
	const [scrollY, setScrollY] = useState(0)

	useEffect(() => {
		setMounted(true)
	}, [])

	useEffect(() => {
		let ticking = false
		const updateScroll = () => {
			rafRef.current = requestAnimationFrame(() => {
				const currentScrollY = window.scrollY
				setScrollY(currentScrollY)
				ticking = false
			})
		}
		const handleScroll = () => {
			if (!ticking) {
				requestAnimationFrame(updateScroll)
				ticking = true
			}
		}
		window.addEventListener('scroll', handleScroll, { passive: true })
		return () => {
			window.removeEventListener('scroll', handleScroll)
			if (rafRef.current) cancelAnimationFrame(rafRef.current)
		}
	}, [])

	useEffect(() => {
		const hasSeenWelcome = localStorage.getItem('dashboardWelcome')
		if (!hasSeenWelcome) {
			const timer = setTimeout(() => {
				setShowAchievement(true)
				localStorage.setItem('dashboardWelcome', 'true')
			}, 1500)
			return () => clearTimeout(timer)
		}
	}, [])

	const stats = useMemo(
		() => ({
			totalXp: totalXp,
			completedCourses: completedCount,
			activeCourses: myCourses.length,
			hasActiveCourse: myCourses.length > 0,
		}),
		[myCourses, completedCount, totalXp]
	)

	const getGreeting = useCallback(() => {
		const hour = new Date().getHours()
		if (hour < 6) return 'Доброй ночи'
		if (hour < 12) return 'Доброе утро'
		if (hour < 18) return 'Добрый день'
		return 'Добрый вечер'
	}, [])

	const getMotivationalMessage = useCallback((activeCount: number) => {
		if (activeCount === 0) return 'Начните первый курс!'
		if (activeCount === 1) return '1 активный курс'
		if (activeCount < 5) return `${activeCount} активных курса`
		return `${activeCount} активных курсов`
	}, [])

	return (
		<div className='min-h-screen text-slate-200 p-4 md:p-6 lg:p-8 space-y-8 md:space-y-10 relative'>
			<div
				className='fixed inset-0 pointer-events-none overflow-hidden -z-10'
				style={{
					transform: `translateY(${scrollY * 0.2}px)`,
					willChange: 'transform',
					contain: 'paint',
				}}
			>
				<div
					className='absolute top-20 left-10 w-[350px] h-[350px] bg-indigo-500/5 rounded-full blur-xl animate-pulse slow-spin'
					style={{ animationDuration: '20s' }}
				/>
				<div
					className='absolute bottom-20 right-10 w-[350px] h-[350px] bg-purple-500/5 rounded-full blur-xl animate-pulse slow-spin'
					style={{ animationDuration: '25s', animationDelay: '5s' }}
				/>
			</div>

			<AchievementNotification
				show={showAchievement}
				onClose={() => setShowAchievement(false)}
				title='Добро пожаловать! 🎉'
				description='Начни своё обучение и получай награды'
			/>

			<div
				className={cn(
					'grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 transition-all duration-1000 ease-out',
					mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
				)}
			>
				<WelcomeCard
					greeting={getGreeting()}
					userName={user?.name || 'Студент'}
					message={getMotivationalMessage(stats.activeCourses)}
				/>
				<div className='flex flex-col gap-3 lg:grid-cols-2 lg:gap-4'>
					<AppleStatCard
						icon={<Trophy className='w-5 h-5 text-emerald-400' />}
						label='Завершено'
						value={stats.completedCourses.toString()}
						subtext='курсов'
						tooltip='Успешно пройденные курсы'
					/>
					<AppleStatCard
						icon={<Zap className='w-5 h-5 text-yellow-400' />}
						label='Всего XP'
						value={stats.totalXp.toLocaleString()}
						tooltip='Общий опыт за все время'
					/>
				</div>
			</div>

			<section
				className={cn(
					'space-y-4 md:space-y-6 transition-all duration-1000 ease-out [animation-delay:100ms]',
					mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
				)}
			>
				<SectionHeader
					icon={<Play className='w-5 h-5 text-indigo-400' />}
					title='Активные курсы'
					subtitle={
						stats.activeCourses > 0
							? `${stats.activeCourses} ${stats.activeCourses === 1 ? 'курс' : stats.activeCourses < 5 ? 'курса' : 'курсов'} в процессе`
							: 'Начни свое обучение'
					}
					actionLabel='Ко всем курсам'
					actionHref={ROUTES.COURSES}
					showAction={true}
				/>
				{isMyCoursesLoading ? (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'>
						{[1, 2, 3, 4, 5, 6].map(i => (
							<ShimmerSkeleton key={i} />
						))}
					</div>
				) : myCourses.length > 0 ? (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'>
						{myCourses.slice(0, 6).map(course => (
							<AppleCourseCard key={course.id} course={course} />
						))}
					</div>
				) : (
					<EmptyState
						icon={<BookOpen className='w-8 h-8 text-slate-600' />}
						title='Нет активных курсов'
						description='Начни свой путь к новым знаниям! Выбери курс из каталога ниже и получи первый опыт.'
						actionLabel='Выбрать курс'
						actionHref={ROUTES.COURSES}
					/>
				)}
			</section>
		</div>
	)
}
