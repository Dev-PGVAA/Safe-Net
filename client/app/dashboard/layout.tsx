'use client'

import DashboardSidebar from '@/components/dashboard-layout/DashboardLayout'
import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'

export default function DashboardLayout({ children }: { children: ReactNode }) {
	const pathname = usePathname()
	const isTestPage = /^\/dashboard\/tests\/[^/]+$/.test(pathname)

	return (
		<div className='flex min-h-screen bg-background text-foreground'>
			{!isTestPage && <DashboardSidebar />}

			<main className='min-w-0 flex-1 overflow-x-hidden'>{children}</main>
		</div>
	)
}
