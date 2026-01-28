import { ReactNode } from 'react'

export interface NavItem {
	label: string
	href: string
	icon: ReactNode
	adminOnly?: boolean
	children?: {
		label: string
		href: string
	}[]
}

export interface DashboardUser {
	id: string
	name: string
	email: string
	rights: string[]
	status: 'ACTIVE' | 'BLOCKED'
	createdAt: string
}
