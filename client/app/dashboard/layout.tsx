import DashboardSidebar from '@/components/dashboard-layout/DashboardLayout'
import { ReactNode } from 'react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
	return (
		<div className='flex h-screen'>
			<DashboardSidebar />

			{/* Main Content */}
			<div className='flex-1 overflow-x-hidden'>
				{/* Content */}
				<main className='flex-1 overflow-x-hidden'>
					<div className='p-8'>{children}</div>
				</main>
			</div>
		</div>
	)
}
