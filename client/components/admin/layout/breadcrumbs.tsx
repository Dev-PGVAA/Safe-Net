'use client'

import { m } from 'framer-motion'
import { ChevronRight, Home } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const breadcrumbLabels: Record<string, string> = {
	admin: 'Админ-панель',
	learning: 'Обучение',
	courses: 'Курсы',
	lessons: 'Уроки',
	tests: 'Тесты',
	users: 'Пользователи',
	stats: 'Статистика',
	overview: 'Обзор',
	settings: 'Настройки',
	edit: 'Редактирование',
}

export default function Breadcrumbs() {
	const pathname = usePathname()

	const segments = pathname
		.split('/')
		.filter(Boolean)
		.filter(s => s !== 'dashboard')

	if (segments.length <= 1) return null

	return (
		<m.nav
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 px-6 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg'
		>
			<Link
				href='/dashboard/admin'
				className='flex items-center gap-1 hover:text-gray-900 dark:hover:text-white transition'
			>
				<Home className='w-4 h-4' />
				<span>Главная</span>
			</Link>

			{segments.map((segment, index) => {
				const href = `/dashboard/${segments.slice(0, index + 1).join('/')}`
				const label =
					breadcrumbLabels[segment] ||
					segment.charAt(0).toUpperCase() + segment.slice(1)
				const isLast = index === segments.length - 1

				return (
					<m.div key={segment} className='flex items-center gap-2'>
						<ChevronRight className='w-4 h-4' />
						{isLast ? (
							<span className='text-gray-900 dark:text-white font-medium'>
								{label}
							</span>
						) : (
							<Link
								href={href}
								className='hover:text-gray-900 dark:hover:text-white transition'
							>
								{label}
							</Link>
						)}
					</m.div>
				)
			})}
		</m.nav>
	)
}
