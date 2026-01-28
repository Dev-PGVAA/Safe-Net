'use client'

import { Button } from '@/components/ui/button'
import { ROUTES } from '@/config/pages-url.config'
import { adminService } from '@/services/admin/admin.service'
import { m } from 'framer-motion'
import { Clock, Edit, Layers, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface LessonsListProps {
	lessons: any[]
	courseId: string
	onUpdate: () => void
}

export default function LessonsList({ lessons, onUpdate }: LessonsListProps) {
	const handleDeleteLesson = async (lessonId: string, lessonTitle: string) => {
		if (!window.confirm(`Вы уверены? Удаление урока "${lessonTitle}" также удалит все блоки и задания.`)) return

		try {
			await adminService.deleteLesson(lessonId)
			toast.success('Урок удален')
			onUpdate()
		} catch (error) {
			toast.error('Ошибка при удалении урока')
		}
	}

	return (
		<div className='space-y-3'>
			{lessons
				?.sort((a, b) => (a.order || 0) - (b.order || 0))
				.map((lesson, i) => (
					<m.div
						key={lesson.id}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: i * 0.05 }}
						className='flex items-center gap-4 p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl hover:bg-white/[0.04] hover:border-white/[0.1] transition-all group'
					>
						<div className='flex-1 min-w-0'>
							<div className='flex items-center gap-2'>
								<span className='text-xs font-medium text-blue-400/80 uppercase tracking-wider'>
									№{lesson.order || i + 1}
								</span>
								<h4 className='text-white font-medium truncate'>{lesson.title}</h4>
							</div>

							<div className='flex items-center gap-4 mt-1.5'>
								<div className='flex items-center gap-1.5 text-[13px] text-gray-500'>
									<Layers className='w-3.5 h-3.5' />
									<span>{lesson.blocks?.length || 0} {lesson.blocks?.length === 1
										? 'блок'
										: lesson.blocks.length < 5
											? 'блока'
											: 'блоков'}</span>
								</div>
								{lesson.estimatedDuration && (
									<div className='flex items-center gap-1.5 text-[13px] text-gray-500'>
										<Clock className='w-3.5 h-3.5' />
										<span>{lesson.estimatedDuration} мин</span>
									</div>
								)}
							</div>
						</div>

						<div className='flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
							<Link href={`${ROUTES.ADMIN.LEARNING.LESSONS}/${lesson.id}/edit`}>
								<Button
									variant='ghost'
									size='icon'
									className='h-9 w-9 text-gray-400 hover:text-white hover:bg-white/10'
								>
									<Edit className='w-4 h-4' />
								</Button>
							</Link>
							<Button
								variant='ghost'
								size='icon'
								onClick={() => handleDeleteLesson(lesson.id, lesson.title)}
								className='h-9 w-9 text-gray-500 hover:text-red-400 hover:bg-red-500/10'
							>
								<Trash2 className='w-4 h-4' />
							</Button>
						</div>
					</m.div>
				))}
		</div>
	)
}
