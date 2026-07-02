'use client'

import { Button } from '@/components/ui/button'
import { adminService } from '@/services/admin/admin.service'
import { IUserDetail, UserStatus } from '@/services/admin/admin.types'
import { UserRoleLabel } from '@/services/auth/auth.types'
import { formatDate } from '@/utils/date-time/dateFormatter'

import { m } from 'framer-motion'
import {
	CalendarDays,
	CheckCircle2,
	Lock,
	Mail,
	Shield,
	User,
} from 'lucide-react'
import { toast } from 'sonner'

interface UserInfoBlockProps {
	user: IUserDetail
	onUserUpdated: () => void
}

export default function UserInfoBlock({
	user,
	onUserUpdated,
}: UserInfoBlockProps) {
	const handleToggleStatus = async () => {
		const newStatus =
			user.status === UserStatus.ACTIVE ? UserStatus.BLOCKED : UserStatus.ACTIVE

		try {
			await adminService.updateUser(user.id, { status: newStatus })
			toast.success(
				newStatus === UserStatus.ACTIVE
					? 'User unblocked'
					: 'User blocked'
			)
			onUserUpdated()
		} catch (error) {
			toast.error('Error updating status')
		}
	}

	const createdDate =
		formatDate(user.createdAt, {
			format: 'date-long',
			locale: 'ru-RU',
			gracefulFail: true,
		}) || 'Unknown'

	const updatedDate =
		formatDate(user.updatedAt, {
			format: 'date-long',
			locale: 'ru-RU',
			gracefulFail: true,
		}) || 'Unknown'

	return (
		<m.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className='bg-linear-to-br from-white/5 to-white/2 backdrop-blur-xl rounded-2xl border border-white/10 p-6'
		>
			<div className='flex items-start justify-between mb-6'>
				<div>
					<h2 className='text-2xl font-bold text-white mb-2'>{user.name}</h2>
					<div className='flex items-center gap-2 text-white/60'>
						<Mail className='w-4 h-4' />
						<span className='text-sm'>{user.email}</span>
					</div>
				</div>

				<Button
					onClick={handleToggleStatus}
					variant={
						user.status === UserStatus.ACTIVE ? 'destructive' : 'default'
					}
					size='sm'
					className='gap-2'
				>
					{user.status === UserStatus.ACTIVE ? (
						<>
							<Lock className='w-4 h-4' />
							Block
						</>
					) : (
						<>
							<CheckCircle2 className='w-4 h-4' />
							Unblock
						</>
					)}
				</Button>
			</div>

			<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
				<InfoItem
					icon={<User className='w-4 h-4' />}
					label='ID'
					value={user.id.slice(0, 8) + '...'}
				/>
				<InfoItem
					icon={<Shield className='w-4 h-4' />}
					label='Roles'
					value={user.rights.map(r => UserRoleLabel[r]).join(', ')}
				/>
				<InfoItem
					icon={<CalendarDays className='w-4 h-4' />}
					label='Sign Up'
					value={createdDate}
				/>
				<InfoItem
					icon={<CalendarDays className='w-4 h-4' />}
					label='Update'
					value={updatedDate}
				/>
			</div>
		</m.div>
	)
}

function InfoItem({
	icon,
	label,
	value,
}: {
	icon: React.ReactNode
	label: string
	value: string
}) {
	return (
		<div className='bg-white/5 rounded-lg p-3'>
			<div className='flex items-center gap-2 text-white/60 mb-1'>
				{icon}
				<span className='text-xs'>{label}</span>
			</div>
			<p className='text-white text-sm font-medium line-clamp-1'>{value}</p>
		</div>
	)
}
