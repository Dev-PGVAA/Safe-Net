'use client'

import UserDetailView from '@/components/admin/users/user-detail-view'
import { adminService } from '@/services/admin/admin.service'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function UserDetailPage() {
	const params = useParams()
	const userId = params.id as string

	const {
		data: user,
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ['user', userId],
		queryFn: () => adminService.getUserDetail(userId),
	})

	if (isLoading) {
		return (
			<div className='min-h-screen p-8'>
				<div className='max-w-[1400px] mx-auto space-y-6'>
					<div className='h-12 w-48 bg-white/5 rounded-xl animate-pulse' />
					<div className='h-[700px] bg-white/5 rounded-2xl animate-pulse' />
				</div>
			</div>
		)
	}

	if (!user) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='text-center'>
					<h2 className='text-2xl font-bold text-white mb-2'>
						User not found
					</h2>
					<Link
						href='/dashboard/admin/users'
						className='text-blue-400 hover:text-blue-300 font-medium'
					>
						<ArrowLeft size={12} /> Back to list
					</Link>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen text-white'>
			<div className='max-w-[1400px] mx-auto px-6 py-8 space-y-6'>
				{/* Back Button */}
				<Link
					href='/dashboard/admin/users'
					className='inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors group'
				>
					<ArrowLeft className='w-4 h-4 group-hover:-translate-x-1 transition-transform' />
					<span className='font-medium text-sm'>Back to list</span>
				</Link>

				<UserDetailView user={user} onUserUpdated={refetch} />
			</div>
		</div>
	)
}
