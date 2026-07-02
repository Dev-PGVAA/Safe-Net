import { BookOpen, ChartLine, FileText, Home, Shield, Trophy, Users } from 'lucide-react'

import { ROUTES } from '@/config/pages-url.config'
import { NavItem } from './navigation.types'

// Admin Menu Items
export const adminNavItems: NavItem[] = [
	{
		label: 'Management',
		href: ROUTES.ADMIN.ROOT,
		icon: <Shield className='w-[18px] h-[18px]' />,
		adminOnly: true,
		children: [
			{ label: 'Courses', href: ROUTES.ADMIN.LEARNING.COURSES },
			{ label: 'Tests', href: `${ROUTES.ADMIN.ROOT}/learning/tests` },
		],
	},
	{
		label: 'Users',
		href: ROUTES.ADMIN.USERS,
		icon: <Users className='w-[18px] h-[18px]' />,
		adminOnly: true,
	},
	{
		label: 'Statistics',
		href: ROUTES.ADMIN.STATS,
		icon: <ChartLine className='w-[18px] h-[18px]' />,
		adminOnly: true,
	},
]

// User Menu Items
export const navItems: NavItem[] = [
	{
		label: 'Home',
		href: ROUTES.HOME,
		icon: <Home className='w-[18px] h-[18px]' />,
	},
	{
		label: 'My Courses',
		href: ROUTES.COURSES,
		icon: <BookOpen className='w-[18px] h-[18px]' />,
	},
	{
		label: 'Certificates',
		href: ROUTES.CERTIFICATES,
		icon: <FileText className='w-[18px] h-[18px]' />,
	},
	{
		label: 'Achievements',
		href: ROUTES.ACHIEVEMENTS,
		icon: <Trophy className='w-[18px] h-[18px]' />,
	},
]
