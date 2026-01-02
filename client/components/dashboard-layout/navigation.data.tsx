import { BookOpen, FileText, Home, Shield, Users } from 'lucide-react'

import { ROUTES } from '@/config/pages-url.config'
import { NavItem } from './navigation.types'


export const adminNavItems: NavItem[] = [
	{
		label: 'Управление',
		href: ROUTES.ADMIN.ROOT,
		icon: <Shield className="w-[18px] h-[18px]" />,
		adminOnly: true,
		children: [
			{ label: 'Курсы', href: ROUTES.ADMIN.COURSES },
			{ label: 'Статистика', href: ROUTES.ADMIN.STATS }
		]
	},
	{
		label: 'Пользователи',
		href: ROUTES.ADMIN.USERS,
		icon: <Users className="w-[18px] h-[18px]" />,
		adminOnly: true
	}
]
export const navItems: NavItem[] = [
	{
		label: 'Главная',
		href: ROUTES.HOME,
		icon: <Home className="w-[18px] h-[18px]" />
	},
	{
		label: 'Курсы',
		href: ROUTES.COURSES,
		icon: <BookOpen className="w-[18px] h-[18px]" />
	},
	{
		label: 'Сертификаты',
		href: ROUTES.CERTIFICATES,
		icon: <FileText className="w-[18px] h-[18px]" />
	}
]
