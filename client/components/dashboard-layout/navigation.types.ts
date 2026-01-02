import { ReactNode } from 'react'


export interface NavItem {
	label: string
	href: string
	icon: ReactNode
	adminOnly?: boolean
	children?: { label: string; href: string }[]
}
