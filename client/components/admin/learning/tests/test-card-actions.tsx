'use client'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Edit, ExternalLink, MoreVertical, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface TestCardActionsProps {
	testId: string
	testTitle: string
	onDelete: () => void
}

/**
 * Dropdown меню с действиями для карточки теста
 * Использует shadcn DropdownMenu для консистентности UI
 */
export function TestCardActions({
	testId,
	testTitle,
	onDelete,
}: TestCardActionsProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='ghost'
					size='icon'
					className='h-8 w-8'
					aria-label={`Действия для теста ${testTitle}`}
				>
					<MoreVertical className='h-4 w-4' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='w-48'>
				<DropdownMenuItem asChild>
					<Link
						href={`/dashboard/admin/learning/tests/${testId}`}
						className='cursor-pointer'
					>
						<Edit className='mr-2 h-4 w-4' />
						Редактировать
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link
						href={`/dashboard/tests/${testId}`}
						target='_blank'
						className='cursor-pointer'
					>
						<ExternalLink className='mr-2 h-4 w-4' />
						Открыть тест
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={onDelete}
					className='text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/20 cursor-pointer'
				>
					<Trash2 className='mr-2 h-4 w-4' />
					Удалить
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
