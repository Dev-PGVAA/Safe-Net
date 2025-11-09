'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { Eye, EyeOff } from 'lucide-react' // Импортируем иконки
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { IAuthDialog } from './AuthDialog.interface'

export function AuthDialog({
	triggerButton = {
		text: 'Начать обучение',
		className:
			'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-xl shadow-indigo-500/30 flex items-center gap-2 group',
		position: 'end',
	},
	dialogSize = 'md',
	title = 'SafeNet',
	description = 'Введите свои данные для входа в систему или создайте аккаунт',
	showNameField = true,
	children,
}: IAuthDialog) {
	const [open, setOpen] = useState(false)
	const [isLogin, setIsLogin] = useState(true)
	const [agreedToPrivacy, setAgreedToPrivacy] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
	})
	const [showPassword, setShowPassword] = useState(false) // Состояние для отображения пароля

	const { login, register, error: authError } = useAuth()

	useEffect(() => {
		// Очищаем форму и ошибки при переключении между логином и регистрацией
		setFormData({ name: '', email: '', password: '' })
		setAgreedToPrivacy(false)
		setShowPassword(false) // Также сбрасываем показ пароля
	}, [isLogin])

	const sizeClasses = {
		sm: 'sm:max-w-sm',
		md: 'sm:max-w-md',
		lg: 'sm:max-w-lg',
		xl: 'sm:max-w-xl',
		'2xl': 'sm:max-w-2xl',
		'3xl': 'sm:max-w-3xl',
		'4xl': 'sm:max-w-4xl',
		'5xl': 'sm:max-w-5xl',
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!isLogin && !agreedToPrivacy) {
			toast.error('Пожалуйста, согласитесь с обработкой персональных данных')
			return
		}

		setIsLoading(true)
		let result

		try {
			if (isLogin) {
				result = await login(formData.email, formData.password)
				if (result.success) {
					toast.success('Успешный вход в систему!')
					setOpen(false)
				} else {
					toast.error(result.error || 'Ошибка входа')
				}
			} else {
				result = await register(
					formData.name,
					formData.email,
					formData.password
				)
				if (result.success) {
					toast.success('Аккаунт успешно создан!')
					setOpen(false)
				} else {
					toast.error(result.error || 'Ошибка регистрации')
				}
			}
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'Произошла ошибка'
			toast.error(errorMessage)
		} finally {
			setIsLoading(false)
		}
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<button
				type='button'
				className={triggerButton.className}
				onClick={() => setOpen(true)}
			>
				{triggerButton.position === 'start' && triggerButton.icon && (
					<span className='mr-2'>{triggerButton.icon}</span>
				)}
				{triggerButton.text}
				{triggerButton.position === 'end' && triggerButton.icon && (
					<span className='ml-2'>{triggerButton.icon}</span>
				)}
			</button>

			<DialogContent
				className={`${sizeClasses[dialogSize]} bg-gradient-to-b from-slate-900 to-slate-800 border border-slate-700 text-slate-100`}
			>
				<DialogHeader className='text-center'>
					<DialogTitle className='text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent'>
						{isLogin ? `Вход в ${title}` : `Регистрация в ${title}`}
					</DialogTitle>
					<DialogDescription className='text-slate-400 mt-2'>
						{isLogin
							? description
							: `Создайте аккаунт, чтобы начать обучение в ${title}`}
					</DialogDescription>
				</DialogHeader>

				<form className='space-y-4 mt-4' onSubmit={handleSubmit}>
					{!isLogin && showNameField && (
						<div className='space-y-2'>
							<Label htmlFor='name' className='text-slate-300'>
								Имя
							</Label>
							<Input
								id='name'
								name='name'
								type='text'
								placeholder='Введите ваше имя'
								className='bg-slate-800/50 border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
								value={formData.name}
								onChange={handleInputChange}
								required={!isLogin}
							/>
						</div>
					)}
					<div className='space-y-2'>
						<Label htmlFor='email' className='text-slate-300'>
							Email
						</Label>
						<Input
							id='email'
							name='email'
							type='email'
							placeholder='your@email.com'
							className='bg-slate-800/50 border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
							value={formData.email}
							onChange={handleInputChange}
							required
						/>
					</div>
					<div className='relative space-y-2'>
						<Label htmlFor='password' className='text-slate-300'>
							Пароль
						</Label>
						<Input
							id='password'
							name='password'
							type={showPassword ? 'text' : 'password'}
							placeholder='••••••••'
							className='bg-slate-800/50 border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 pr-10'
							value={formData.password}
							onChange={handleInputChange}
							required
						/>
						<button
							type='button'
							className='absolute right-3 top-1/2 transform -translate-y-1/2 translate-y-[-3px] text-slate-400 hover:text-white transition-colors flex items-center justify-center'
							onClick={() => setShowPassword(!showPassword)}
							aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
						>
							{showPassword ? (
								<EyeOff className='w-5 h-5' />
							) : (
								<Eye className='w-5 h-5' />
							)}
						</button>
					</div>

					{!isLogin && (
						<div className='flex items-start space-x-3 pt-2'>
							<Checkbox
								id='privacy'
								checked={agreedToPrivacy}
								onCheckedChange={checked => setAgreedToPrivacy(!!checked)}
								className='mt-0.5 border-slate-600 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600'
							/>
							<div className='text-sm leading-5'>
								<Label
									htmlFor='privacy'
									className='text-slate-400 cursor-pointer'
								>
									Согласен на обработку персональных данных
								</Label>
								<p className='text-xs text-slate-500 mt-1'>
									Принимаю условия пользовательского соглашения и политики
									конфиденциальности
								</p>
							</div>
						</div>
					)}

					{children}

					{/* Ошибка теперь под формой, но над кнопкой */}
					{authError && <div className='text-sm text-red-400'>{authError}</div>}

					<DialogFooter className='flex flex-col gap-4 mt-2'>
						<Button
							type='submit'
							disabled={isLoading || (!isLogin && !agreedToPrivacy)}
							className={`w-full ${
								(!isLogin && !agreedToPrivacy) || isLoading
									? 'bg-slate-700 cursor-not-allowed'
									: 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
							} text-white shadow-md py-5`}
						>
							{isLoading ? (
								<span className='flex items-center justify-center'>
									<svg
										className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
										xmlns='http://www.w3.org/2000/svg'
										fill='none'
										viewBox='0 0 24 24'
									>
										<circle
											className='opacity-25'
											cx='12'
											cy='12'
											r='10'
											stroke='currentColor'
											strokeWidth='4'
										></circle>
										<path
											className='opacity-75'
											fill='currentColor'
											d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
										></path>
									</svg>
									{isLogin ? 'Вход...' : 'Регистрация...'}
								</span>
							) : isLogin ? (
								'Войти в аккаунт'
							) : (
								'Создать аккаунт'
							)}
						</Button>

						<div className='w-full text-center'>
							<button
								type='button'
								className='text-sm text-indigo-400 hover:text-indigo-300 hover:underline'
								onClick={() => setIsLogin(!isLogin)}
							>
								{isLogin
									? 'Нет аккаунта? Зарегистрироваться'
									: 'Уже есть аккаунт? Войти'}
							</button>
						</div>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
