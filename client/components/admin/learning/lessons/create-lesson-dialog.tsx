'use client'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { adminService } from '@/services/admin/admin.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, m } from 'framer-motion'
import { AlertCircle, BookOpen, Clock, Loader2, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const lessonSchema = z.object({
  order: z.number().int().positive('Порядок должен быть больше 0'),
  title: z.string().min(3, 'Название минимум 3 символа').max(255),
  estimatedDuration: z.number().int().positive().optional(),
})

type LessonFormData = z.infer<typeof lessonSchema>

interface CreateLessonDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  courseId: string
  onSuccess: () => void
  existingLessonsCount?: number
}

export default function CreateLessonDialog({
  open,
  onOpenChange,
  courseId,
  onSuccess,
  existingLessonsCount = 0,
}: CreateLessonDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const nextLessonOrder = existingLessonsCount + 1

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      order: nextLessonOrder,
      title: '',
      estimatedDuration: undefined,
    },
  })

  // Обновление order при открытии
  useEffect(() => {
    if (open) {
      setValue('order', nextLessonOrder)
    }
  }, [open, nextLessonOrder, setValue])

  const onSubmit = async (data: LessonFormData) => {
    setIsSubmitting(true)
    try {
      await adminService.createLesson({
        ...data,
        courseId,
      })
      toast.success('Урок создан успешно')
      reset()
      onOpenChange(false)
      onSuccess()
    } catch (error) {
      console.error('Create lesson error:', error)
      toast.error('Ошибка при создании урока')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence mode='wait'>
        {open && (
          <DialogContent className='sm:max-w-[500px] bg-[#0A0F1D]/95 backdrop-blur-2xl border border-white/10 text-white'>
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <DialogTitle className='flex items-center gap-2 text-2xl'>
                  <Sparkles className='w-6 h-6 text-blue-400' />
                  Создать новый урок
                </DialogTitle>
              </DialogHeader>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className='space-y-5 mt-6'
              >
                {/* Order */}
                <div className='space-y-2'>
                  <Label htmlFor='order' className='text-sm font-medium text-gray-300'>
                    Порядковый номер
                  </Label>
                  <Input
                    id='order'
                    type='number'
                    {...register('order', { valueAsNumber: true })}
                    min={1}
                    className='bg-white/5 border-white/10 text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20'
                  />
                  {errors.order && (
                    <p className='text-xs text-red-400 flex items-center gap-1'>
                      <AlertCircle className='w-3 h-3' />
                      {errors.order.message}
                    </p>
                  )}
                </div>

                {/* Title */}
                <div className='space-y-2'>
                  <Label htmlFor='title' className='text-sm font-medium text-gray-300'>
                    Название урока
                  </Label>
                  <Input
                    id='title'
                    type='text'
                    placeholder='Основные угрозы безопасности'
                    {...register('title')}
                    className='bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20'
                  />
                  {errors.title && (
                    <p className='text-xs text-red-400 flex items-center gap-1'>
                      <AlertCircle className='w-3 h-3' />
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Duration */}
                <div className='space-y-2'>
                  <Label htmlFor='duration' className='text-sm font-medium text-gray-300'>
                    Время прохождения{' '}
                    <span className='text-gray-500 font-normal'>(минут, опционально)</span>
                  </Label>
                  <div className='relative'>
                    <Input
                      id='duration'
                      type='number'
                      placeholder='Будет рассчитано автоматически'
                      {...register('estimatedDuration', { valueAsNumber: true })}
                      className='bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 pl-10'
                    />
                    <Clock className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500' />
                  </div>
                  <p className='text-xs text-gray-500 flex items-center gap-1.5'>
                    <span className='w-1 h-1 rounded-full bg-gray-600' />
                    Формула: 2 мин + блоки × 2 мин + задания × 5 мин
                  </p>
                </div>

                {/* Info Box */}
                <div className='p-4 rounded-xl bg-blue-500/5 border border-blue-500/20'>
                  <div className='flex gap-3'>
                    <BookOpen className='w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5' />
                    <div>
                      <p className='text-sm font-semibold text-blue-300 mb-1'>
                        Совет
                      </p>
                      <p className='text-xs text-blue-400/80 leading-relaxed'>
                        После создания урока добавьте блоки контента и задания для полноценного обучения
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className='flex gap-3 pt-4'>
                  <Button
                    type='button'
                    onClick={() => {
                      onOpenChange(false)
                      reset()
                    }}
                    disabled={isSubmitting}
                    variant='outline'
                    className='flex-1 bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-colors'
                  >
                    Отмена
                  </Button>
                  <Button
                    type='submit'
                    disabled={isSubmitting}
                    className='flex-1 gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white'
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className='w-4 h-4 animate-spin' />
                        Создание...
                      </>
                    ) : (
                      <>
                        <BookOpen className='w-4 h-4' />
                        Создать урок
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </m.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  )
}
