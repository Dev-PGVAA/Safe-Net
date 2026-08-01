'use client'

import { AuthDialog } from '@/components/Auth/AuthDialog'
import { MOTION } from '@/config/motion.config'
import { useI18n } from '@/i18n/LocaleProvider'
import { m } from 'framer-motion'
import {
	BookOpen,
	CheckCircle,
	FishingHook,
	ShieldCheck,
	XCircle,
	Zap,
} from '@/components/ui/icons'
import { useState } from 'react'

export default function DemoCard() {
	const { t } = useI18n()
	const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

	return (
		<m.div
			initial={{ opacity: 0, x: 12 }}
			whileInView={{ opacity: 1, x: 0 }}
			viewport={{ once: true, amount: 0.3 }}
			transition={{ duration: MOTION.reveal, ease: MOTION.ease }}
			className='relative'
		>
			<div className='absolute inset-0 bg-linear-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-2xl' />
			<div className='relative bg-slate-800 rounded-2xl shadow-2xl p-6 border border-slate-700'>
				<div className='flex items-center justify-between mb-4'>
					<div>
						<h3 className='font-semibold text-white text-lg'>{t.demo.level}</h3>
						<p className='text-xs text-slate-400'>{t.demo.prompt}</p>
					</div>
					<div className='w-12 h-12 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center'>
						<FishingHook className='w-7 h-7 text-white' />
					</div>
				</div>

				<div className='bg-slate-900/50 rounded-xl p-4 mb-4 border border-slate-700'>
					<p className='text-sm text-slate-200 mb-2'>
						<span className='text-slate-400'>{t.demo.sender}</span>{' '}
						<a href='mailto:support@bank-pay.com' className='underline'>
							support@bank-pay.com
						</a>
					</p>
					<p className='text-sm text-slate-400'>{t.demo.message}</p>
				</div>

				{isCorrect !== null && (
					<m.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: MOTION.standard, ease: MOTION.ease }}
						className={`mb-4 p-3 rounded-xl flex items-center gap-2 ${
							isCorrect
								? 'border border-emerald-300 bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-900/30'
								: 'border border-rose-300 bg-rose-100 dark:border-rose-700 dark:bg-rose-900/30'
						}`}
					>
						{isCorrect ? (
							<CheckCircle className='w-5 h-5 text-emerald-700 dark:text-emerald-400' />
						) : (
							<XCircle className='w-5 h-5 text-rose-700 dark:text-rose-400' />
						)}
						<span
							className={`text-sm ${
								isCorrect
									? 'text-emerald-800 dark:text-emerald-200'
									: 'text-rose-800 dark:text-rose-200'
							}`}
						>
							{isCorrect ? t.demo.correct : t.demo.incorrect}
						</span>
					</m.div>
				)}

				<div className='grid grid-cols-2 gap-3'>
					<button
						className={`${
							isCorrect === false
								? 'border-rose-400 bg-rose-100 text-rose-800 dark:border-rose-500 dark:bg-rose-900/50 dark:text-rose-200'
								: 'border-emerald-300 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200 dark:hover:bg-emerald-900/50'
						} flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-300 ease-out`}
						onClick={() => setIsCorrect(false)}
						disabled={isCorrect !== null}
						aria-pressed={isCorrect === false}
					>
						<CheckCircle className='w-4 h-4' />
						{t.demo.safe}
					</button>
					<button
						className={`${
							isCorrect === true
								? 'border-emerald-400 bg-emerald-100 text-emerald-800 dark:border-emerald-500 dark:bg-emerald-900/50 dark:text-emerald-200'
								: 'border-rose-300 bg-rose-100 text-rose-800 hover:bg-rose-200 dark:border-rose-700 dark:bg-rose-900/30 dark:text-rose-200 dark:hover:bg-rose-900/50'
						} flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-300 ease-out`}
						onClick={() => setIsCorrect(true)}
						disabled={isCorrect !== null}
						aria-pressed={isCorrect === true}
					>
						<XCircle className='w-4 h-4' />
						{t.demo.dangerous}
					</button>
				</div>

				{isCorrect === null && (
					<m.div
						initial={{ opacity: 0, y: 10 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{
							duration: MOTION.standard,
							delay: MOTION.stagger,
							ease: MOTION.ease,
						}}
						className='mt-4 flex items-start gap-2 text-xs text-slate-500 bg-slate-900/30 rounded-lg p-3'
					>
						<Zap className='w-4 h-4 text-yellow-500 shrink-0 mt-0.5' />
						<span>{t.demo.hint}</span>
					</m.div>
				)}

				{isCorrect !== null && (
					<div className='mt-4 space-y-2'>
						<AuthDialog
							triggerButton={{
								text: t.demo.tryAnother,
								icon: <BookOpen className='w-4 h-4' />,
								position: 'start',
								className:
									'w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg hover:scale-[1.01] transition-transform',
							}}
						/>
						<a
							href='/guard'
							className='w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/50 text-sm text-slate-300 hover:text-white hover:border-slate-600 transition-colors'
						>
							<ShieldCheck className='w-4 h-4 text-indigo-400' />
							{t.demo.guardLink}
						</a>
					</div>
				)}
			</div>
		</m.div>
	)
}
