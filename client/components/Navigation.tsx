'use client'

import { Menu, Shield, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function Navigation() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

	return (
		<nav className='sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex items-center justify-between h-16'>
					<div className='flex items-center gap-3'>
						<div className='w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center'>
							<Shield className='w-6 h-6 text-white' />
						</div>
						<div>
							<h1 className='text-lg font-bold'>SafeNet</h1>
							<p className='text-xs text-slate-400 -mt-1'>
								Учись. Играя. Защищайся.
							</p>
						</div>
					</div>

					<div className='hidden md:flex items-center gap-6'>
						<a
							href='#features'
							className='text-sm text-slate-300 hover:text-white transition-colors'
						>
							Возможности
						</a>
						<a
							href='#topics'
							className='text-sm text-slate-300 hover:text-white transition-colors'
						>
							Темы
						</a>
						<a
							href='#stats'
							className='text-sm text-slate-300 hover:text-white transition-colors'
						>
							Статистика
						</a>
						<Link
							href='/onboarding'
							className='bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-2 rounded-lg font-medium transition-all shadow-lg shadow-indigo-500/20'
						>
							Начать
						</Link>
					</div>

					<button
						className='md:hidden text-slate-300'
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					>
						{mobileMenuOpen ? (
							<X className='w-6 h-6' />
						) : (
							<Menu className='w-6 h-6' />
						)}
					</button>
				</div>

				{mobileMenuOpen && (
					<div className='md:hidden py-4 space-y-3 border-t border-slate-800'>
						<a
							href='#features'
							className='block text-sm text-slate-300 hover:text-white transition-colors'
						>
							Возможности
						</a>
						<a
							href='#topics'
							className='block text-sm text-slate-300 hover:text-white transition-colors'
						>
							Темы
						</a>
						<a
							href='#stats'
							className='block text-sm text-slate-300 hover:text-white transition-colors'
						>
							Статистика
						</a>
						<Link
							href='/onboarding'
							className='block w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-lg font-medium text-center'
						>
							Начать
						</Link>
					</div>
				)}
			</div>
		</nav>
	)
}
