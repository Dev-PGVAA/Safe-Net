'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { adminService } from '@/services/admin/admin.service'
import { ICourse } from '@/services/admin/admin.types'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, m } from 'framer-motion'
import {
    AlertCircle,
    ChevronDown,
    FileQuestion,
    Loader2,
    Plus,
    Sparkles,
    X,
} from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const testSchema = z.object({
	title: z.string().min(3, 'Minimum 3 characters').max(255),
	description: z.string().min(10, 'Minimum 10 characters').optional(),
	courseId: z.string().optional(),
	passingScore: z.number().min(0).max(100).optional(),
})

type TestFormData = z.infer<typeof testSchema>

interface CreateTestDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	courses: ICourse[]
	onSuccess: () => void
}

export default function CreateTestDialog({
	open,
	onOpenChange,
	courses,
	onSuccess,
}: CreateTestDialogProps) {
	const [isSubmitting, setIsSubmitting] = useState(false)

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
		reset,
	} = useForm<TestFormData>({
		resolver: zodResolver(testSchema),
		defaultValues: {
			title: '',
			description: '',
			courseId: '',
			passingScore: 80,
		},
	})

	const onSubmit = async (data: TestFormData) => {
		setIsSubmitting(true)
		try {
			await adminService.createTest(data)
			toast.success('Test created successfully')
			reset()
			onOpenChange(false)
			onSuccess()
		} catch (error) {
			console.error('Create test error:', error)
			toast.error('Error creating test')
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<AnimatePresence>
			{open && (
				<m.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className='fixed inset-0 z-[100] bg-[#0A0F1D] overflow-y-scroll'
				>
					{/* Header */}
					<div className='border-b border-white/10 bg-[#0A0F1D]/80 backdrop-blur-xl'>
						<div className='mx-auto flex max-w-4xl items-center justify-between px-6 py-4'>
							<div>
								<h3 className='text-2xl font-bold text-white'>Create Test</h3>
								<p className='mt-1 text-sm text-gray-500'>
									Add a test to check knowledge for a course
								</p>
							</div>
							<m.button
								whileHover={{ scale: 1.1, rotate: 90 }}
								whileTap={{ scale: 0.9 }}
								onClick={() => {
									onOpenChange(false)
									reset()
								}}
								className='rounded-xl bg-white/5 p-3 text-gray-400 transition-colors hover:bg-white/10 hover:text-white'
							>
								<X className='h-5 w-5' />
							</m.button>
						</div>
					</div>

					{/* Content */}
					<div className='mx-auto max-w-4xl px-6 py-8'>
						<m.form
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.1 }}
							onSubmit={handleSubmit(onSubmit)}
							className='space-y-8'
						>
							{/* Basic Info */}
							<div className='rounded-2xl border border-white/10 bg-white/5 p-6'>
								<h4 className='mb-4 flex items-center gap-2 text-lg font-semibold text-white'>
									<Sparkles className='h-5 w-5 text-blue-400' />
									Basic Information
								</h4>

								<div className='space-y-6'>
									<div>
										<label className='mb-2 block text-sm font-semibold text-white'>
											Test Title
										</label>
										<input
											{...register('title')}
											className='w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-all focus:border-blue-500/50 focus:bg-white/10'
											placeholder='Cybersecurity Basics'
										/>
										{errors.title && (
											<p className='mt-2 text-sm text-red-400'>
												{errors.title.message}
											</p>
										)}
									</div>

									<div>
										<label className='mb-2 block text-sm font-semibold text-white'>
											Description
										</label>
										<textarea
											{...register('description')}
											rows={4}
											className='w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-all focus:border-blue-500/50 focus:bg-white/10 resize-none'
											placeholder='A test to check basic knowledge of information security'
										/>
										{errors.description && (
											<p className='mt-2 text-sm text-red-400'>
												{errors.description.message}
											</p>
										)}
									</div>
								</div>
							</div>

							{/* Settings */}
							<div className='rounded-2xl border border-white/10 bg-white/5 p-6'>
								<h4 className='mb-4 flex items-center gap-2 text-lg font-semibold text-white'>
									<FileQuestion className='h-5 w-5 text-purple-400' />
									Test Settings
								</h4>

								<div className='grid gap-6 md:grid-cols-2'>
									<div>
										<label className='mb-2 block text-sm font-semibold text-white'>
											Course (optional)
										</label>
										<Controller
											name='courseId'
											control={control}
											render={({ field }) => (
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<button
															type='button'
															className='flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition-all hover:bg-white/10'
														>
															<span className='truncate'>
																{field.value
																	? courses.find((c) => c.id === field.value)
																			?.title || 'Select a course'
																	: 'No course'}
															</span>
															<ChevronDown className='h-4 w-4 text-gray-400 flex-shrink-0 ml-2' />
														</button>
													</DropdownMenuTrigger>
													<DropdownMenuContent className='w-[var(--radix-dropdown-menu-trigger-width)] max-h-60 overflow-y-auto bg-[#0A0F1D] border-white/10 z-[9999]'>
														<DropdownMenuItem
															onClick={() => field.onChange('')}
															className='text-white hover:bg-white/10 cursor-pointer'
														>
															No course
														</DropdownMenuItem>
														{courses.map((course) => (
															<DropdownMenuItem
																key={course.id}
																onClick={() => field.onChange(course.id)}
																className='text-white hover:bg-white/10 cursor-pointer'
															>
																{course.title}
															</DropdownMenuItem>
														))}
													</DropdownMenuContent>
												</DropdownMenu>
											)}
										/>
									</div>

									<div>
										<label className='mb-2 block text-sm font-semibold text-white'>
											Passing Score (%)
										</label>
										<input
											{...register('passingScore', { valueAsNumber: true })}
											type='number'
											min='0'
											max='100'
											className='w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-all focus:border-blue-500/50 focus:bg-white/10'
											placeholder='80'
										/>
									</div>
								</div>
							</div>

							{/* Info Block */}
							<div className='rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6'>
								<div className='flex items-start gap-3'>
									<div className='rounded-lg bg-blue-500/10 p-2'>
										<AlertCircle className='h-5 w-5 text-blue-400' />
									</div>
									<div>
										<h5 className='font-semibold text-white'>
											After creation
										</h5>
										<p className='mt-1 text-sm text-gray-400'>
											You'll be able to add questions to the test on the
											editing page. A minimum of 5 questions is recommended
											for a complete test.
										</p>
									</div>
								</div>
							</div>

							{/* Actions */}
							<div className='flex gap-4'>
								<m.button
									type='button'
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									onClick={() => {
										onOpenChange(false)
										reset()
									}}
									className='flex-1 rounded-xl border border-white/10 bg-white/5 px-6 py-4 font-semibold text-gray-300 transition-all hover:bg-white/10'
								>
									Cancel
								</m.button>
								<m.button
									type='submit'
									disabled={isSubmitting}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									className='flex-1 rounded-xl bg-white px-6 py-4 font-semibold text-black transition-all hover:bg-white/90 disabled:opacity-50'
								>
									{isSubmitting ? (
										<>
											<Loader2 className='mr-2 inline h-5 w-5 animate-spin' />
											Creating...
										</>
									) : (
										<>
											<Plus className='mr-2 inline h-5 w-5' />
											Create Test
										</>
									)}
								</m.button>
							</div>
						</m.form>
					</div>
				</m.div>
			)}
		</AnimatePresence>
	)
}
