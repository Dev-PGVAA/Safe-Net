'use client'

import { Button } from '@/components/ui/button'
// Import DropdownMenu components
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { adminService } from '@/services/admin/admin.service'
import { Difficulty, ICourse } from '@/services/admin/admin.types'
import { DifficultyLabel } from '@/services/learning/learning.types'
import { zodResolver } from '@hookform/resolvers/zod'
import { m } from 'framer-motion'
import { ChevronDown, Edit2, Loader2, Save, X } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const courseEditSchema = z.object({
	title: z.string().min(3, 'Minimum 3 characters').max(255),
	description: z.string().min(10, 'Minimum 10 characters'),
	difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
})

type CourseEditData = z.infer<typeof courseEditSchema>

interface CourseEditFormProps {
	course: ICourse
	onSuccess: () => void
}

export default function CourseEditForm({ course, onSuccess }: CourseEditFormProps) {
	const [isEditing, setIsEditing] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const {
		register,
		handleSubmit,
		setValue, // Used to update the value from the dropdown
		watch,    // Track the current difficulty value
		formState: { errors },
		reset,
	} = useForm<CourseEditData>({
		resolver: zodResolver(courseEditSchema),
		defaultValues: {
			title: course.title,
			description: course.description,
			difficulty: (course.difficulty as 'EASY' | 'MEDIUM' | 'HARD') || 'MEDIUM',
		},
	})

	const currentDifficulty = watch('difficulty')

	const onSubmit = async (data: CourseEditData) => {
		setIsSubmitting(true)
		try {
			await adminService.updateCourse(course.id, data)
			toast.success('Course updated')
			setIsEditing(false)
			onSuccess()
		} catch (error) {
			toast.error('Error while updating')
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
			{!isEditing ? (
				<div className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<div className="space-y-1">
							<p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Title</p>
							<p className="text-white font-medium text-lg">{course.title}</p>
						</div>

						<div className="space-y-1">
							<p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</p>
							<p className="text-white font-medium">
								{DifficultyLabel[course.difficulty || Difficulty.EASY]}
							</p>
						</div>
					</div>

					<div className="space-y-1">
						<p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Description</p>
						<p className="text-gray-400 text-sm leading-relaxed">{course.description}</p>
					</div>

					<div className="pt-4">
						<Button
							onClick={() => setIsEditing(true)}
							className="gap-2 bg-white text-black hover:bg-white/90 font-semibold px-8"
						>
							<Edit2 className="w-4 h-4" />
							Edit information
						</Button>
					</div>
				</div>
			) : (
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-400">Course title</label>
							<input
								type="text"
								{...register('title')}
								className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
							/>
							{errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-400">Difficulty</label>
							{/* Dropdown Menu instead of Select */}
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<button
										type="button"
										className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition outline-none"
									>
										<span>{DifficultyLabel[currentDifficulty]}</span>
										<ChevronDown className="w-4 h-4 text-gray-400" />
									</button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="start"
									className="w-56 bg-[#0A0F1D] border-white/10 text-white"
								>
									<DropdownMenuItem
										onClick={() => setValue('difficulty', 'EASY')}
										className="hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer"
									>
										Easy
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => setValue('difficulty', 'MEDIUM')}
										className="hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer"
									>
										Medium
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => setValue('difficulty', 'HARD')}
										className="hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer"
									>
										Hard
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium text-gray-400">Description</label>
						<textarea
							{...register('description')}
							rows={4}
							className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 outline-none transition resize-none"
						/>
						{errors.description && <p className="text-xs text-red-400">{errors.description.message}</p>}
					</div>

					<div className="flex items-center gap-3 pt-4">
						<Button
							type="submit"
							disabled={isSubmitting}
							className="gap-2 bg-white text-black hover:bg-white/90 font-semibold px-8"
						>
							{isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
							Save changes
						</Button>

						<Button
							type="button"
							variant="ghost"
							onClick={() => {
								setIsEditing(false)
								reset()
							}}
							className="gap-2 text-gray-400 hover:text-white hover:bg-white/5"
						>
							<X className="w-4 h-4" />
							Cancel
						</Button>
					</div>
				</form>
			)}
		</m.div>
	)
}
