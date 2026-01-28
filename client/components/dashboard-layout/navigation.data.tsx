import { BookOpen, ChartLine, FileText, Home, Shield, Trophy, Users } from 'lucide-react'

import { ROUTES } from '@/config/pages-url.config'
import { NavItem } from './navigation.types'

// Admin Menu Items
export const adminNavItems: NavItem[] = [
	{
		label: 'Управление',
		href: ROUTES.ADMIN.ROOT,
		icon: <Shield className='w-[18px] h-[18px]' />,
		adminOnly: true,
		children: [
			{ label: 'Курсы', href: ROUTES.ADMIN.LEARNING.COURSES },
			{ label: 'Тесты', href: `${ROUTES.ADMIN.ROOT}/learning/tests` },
		],
	},
	{
		label: 'Пользователи',
		href: ROUTES.ADMIN.USERS,
		icon: <Users className='w-[18px] h-[18px]' />,
		adminOnly: true,
	},
	{
		label: 'Статистика',
		href: ROUTES.ADMIN.STATS,
		icon: <ChartLine className='w-[18px] h-[18px]' />,
		adminOnly: true,
	},
]

// User Menu Items
export const navItems: NavItem[] = [
	{
		label: 'Главная',
		href: ROUTES.HOME,
		icon: <Home className='w-[18px] h-[18px]' />,
	},
	{
		label: 'Мои курсы',
		href: ROUTES.COURSES,
		icon: <BookOpen className='w-[18px] h-[18px]' />,
	},
	{
		label: 'Сертификаты',
		href: ROUTES.CERTIFICATES,
		icon: <FileText className='w-[18px] h-[18px]' />,
	},
	{
		label: 'Достижения',
		href: ROUTES.ACHIEVEMENTS,
		icon: <Trophy className='w-[18px] h-[18px]' />,
	},
]
