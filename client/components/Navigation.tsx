'use client'

import { useAuth } from '@/hooks/useAuth'
import { LogOut, Menu, Settings, Shield, User, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'

export default function Navigation() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	const [userMenuOpen, setUserMenuOpen] = useState(false)
	const { user, isAuthenticated, logout } = useAuth()

	const userMenuRef = useRef<HTMLDivElement>(null)

	// Закрываем меню при клике вне его области
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				userMenuRef.current &&
				!userMenuRef.current.contains(event.target as Node)
			) {
				setUserMenuOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	const handleLogout = async () => {
		try {
			await logout()
			toast.success('Вы успешно вышли из системы')
			// Перезагружаем страницу после выхода
			window.location.reload()
		} catch (error) {
			toast.error('Ошибка при выходе из системы')
		}
	}

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

					{/* Desktop Menu */}
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

						{/* Auth section */}
						{isAuthenticated ? (
							<div className='relative' ref={userMenuRef}>
								<div
									className='w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg cursor-pointer hover:opacity-80 transition-opacity'
									onClick={() => setUserMenuOpen(!userMenuOpen)}
								>
									{user!.name?.charAt(0).toUpperCase() ||
										user!.email?.charAt(0).toUpperCase()}
								</div>

								{/* Выпадающее меню */}
								{userMenuOpen && (
									<div className='absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg py-2 z-20'>
										<div className='px-4 py-2 border-b border-slate-700'>
											<p className='text-sm text-slate-300 truncate'>
												{user?.name || user?.email}
											</p>
											<p className='text-xs text-slate-500 truncate'>
												{user?.email}
											</p>
										</div>

										<button
											onClick={() => {
												// Добавь сюда навигацию в профиль, если нужно
												setUserMenuOpen(false)
											}}
											className='w-full text-left px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-2'
										>
											<User className='w-4 h-4' />
											Профиль
										</button>

										<button
											onClick={() => {
												// Добавь сюда навигацию в настройки, если нужно
												setUserMenuOpen(false)
											}}
											className='w-full text-left px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-2'
										>
											<Settings className='w-4 h-4' />
											Настройки
										</button>

										<button
											onClick={handleLogout}
											className='w-full text-left px-4 py-2 text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-colors flex items-center gap-2'
										>
											<LogOut className='w-4 h-4' />
											Выйти
										</button>
									</div>
								)}
							</div>
						) : (
							<></>
						)}
					</div>

					{/* Mobile menu button */}
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

				{/* Mobile Menu */}
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

						{/* Auth in Mobile */}
						{isAuthenticated ? (
							<>
								<div className='text-sm text-slate-300 p-2 bg-slate-800/50 rounded'>
									{user?.name || user?.email}
								</div>
								<button
									onClick={handleLogout}
									className='block text-left w-full text-red-400 hover:text-red-300 transition-colors flex items-center gap-2'
								>
									<LogOut className='w-4 h-4' />
									Выйти
								</button>
							</>
						) : (
							<></>
						)}
					</div>
				)}
			</div>
		</nav>
	)
}
