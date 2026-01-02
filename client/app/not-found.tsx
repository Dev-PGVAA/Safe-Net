'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { m } from 'framer-motion'

import { ArrowLeft, Home, Shield, ShieldAlert } from 'lucide-react'

export default function NotFound() {
	const router = useRouter()
	return (
		<div className='min-h-screen bg-slate-950 flex items-center justify-center px-4'>
			<div className='max-w-2xl w-full'>
				<m.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
					className='text-center'
				>
					{}
					<m.div
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ delay: 0.2, duration: 0.6 }}
						className='mb-12 flex justify-center'
					>
						<div className='relative w-64 h-64'>
							<m.div
								animate={{
									scale: [1, 1.05, 1],
									opacity: [0.4, 0.6, 0.4],
								}}
								transition={{
									duration: 4,
									repeat: Infinity,
									ease: 'easeInOut',
								}}
								className='absolute inset-0 bg-slate-800/50 rounded-full blur-xl'
							/>
							{}
							<m.div
								animate={{
									y: [0, -10, 0],
								}}
								transition={{
									duration: 3,
									repeat: Infinity,
									ease: 'easeInOut',
								}}
								className='absolute inset-0 flex items-center justify-center'
							>
								<div className='w-32 h-32 bg-linear-to-br from-slate-800 to-slate-900 rounded-3xl flex items-center justify-center shadow-2xl border border-slate-700/50'>
									<ShieldAlert
										className='w-16 h-16 text-slate-500'
										strokeWidth={1.5}
									/>
								</div>
							</m.div>
							{}
							<m.div
								animate={{
									x: [0, 20, 0],
									y: [0, -20, 0],
									rotate: [0, 10, 0],
								}}
								transition={{
									duration: 5,
									repeat: Infinity,
									ease: 'easeInOut',
								}}
								className='absolute top-8 right-8 w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl shadow-lg flex items-center justify-center'
							>
								<Shield className='w-6 h-6 text-slate-600' strokeWidth={2} />
							</m.div>
							<m.div
								animate={{
									x: [0, -20, 0],
									y: [0, 20, 0],
									rotate: [0, -10, 0],
								}}
								transition={{
									duration: 6,
									repeat: Infinity,
									ease: 'easeInOut',
									delay: 1,
								}}
								className='absolute bottom-8 left-8 w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg opacity-60'
							/>
						</div>
					</m.div>
					{}
					<m.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.4, duration: 0.6 }}
					>
						<h1 className='text-[80px] sm:text-[100px] font-semibold tracking-tighter text-white leading-none mb-4'>
							404
						</h1>
						<h2 className='text-[28px] sm:text-[32px] font-semibold text-white mb-3 tracking-tight'>
							Защита не обнаружена
						</h2>
						<p className='text-[17px] text-slate-400 max-w-md mx-auto mb-10 leading-relaxed'>
							Похоже, эта страница ушла в безопасное хранилище. Давайте вернем
							вас в безопасную зону.
						</p>
					</m.div>
					{}
					<m.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.6, duration: 0.6 }}
						className='flex flex-col sm:flex-row items-center justify-center gap-3'
					>
						<m.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={() => router.back()}
							className='inline-flex items-center gap-2 px-6 py-3.5 bg-slate-900 border border-slate-800 text-white rounded-[12px] text-[15px] font-medium hover:bg-slate-800 transition-colors min-w-[140px] justify-center'
						>
							<ArrowLeft className='w-4 h-4' strokeWidth={2} />
							<span>Назад</span>
						</m.button>
						<m.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
							<Link
								href='/'
								className='inline-flex items-center gap-2 px-6 py-3.5 bg-white text-slate-900 rounded-[12px] text-[15px] font-medium hover:bg-slate-100 transition-colors shadow-sm min-w-[140px] justify-center'
							>
								<Home className='w-4 h-4' strokeWidth={2} />
								<span>На главную</span>
							</Link>
						</m.div>
					</m.div>
					{}
					<m.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.8, duration: 0.6 }}
						className='mt-16 pt-8 border-t border-slate-800'
					>
						<div className='flex items-center justify-center gap-2 text-slate-500'>
							<Shield className='w-4 h-4' strokeWidth={2} />
							<span className='text-[13px] font-medium'>
								SafeNet – Ваша безопасность важна
							</span>
						</div>
					</m.div>
				</m.div>
			</div>
		</div>
	)
}
