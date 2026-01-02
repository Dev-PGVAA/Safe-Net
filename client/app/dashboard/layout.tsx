import DashboardSidebar from '@/components/dashboard-layout/DashboardLayout'
import { NO_INDEX_PAGE } from '@/constants/seo.constants'
import { Metadata } from 'next'
import type { PropsWithChildren } from 'react'


export const metadata: Metadata = {
	...NO_INDEX_PAGE
}
export default function Layout({ children }: PropsWithChildren<unknown>) {
	return (
		<div className="flex min-h-screen">
			<DashboardSidebar />
			<main className="flex-1 overflow-x-hidden">
				<div className="p-8">{children}</div>
			</main>
		</div>
	)
}
