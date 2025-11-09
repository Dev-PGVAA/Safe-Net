'use client'

// TODO: доделать панель авторизации исправить баги и добавить checkbox согласен на обработку персональных

import { Button } from '@/components/ui/button'
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
import { useState } from 'react'

export function AuthDialog() {
	const [open, setOpen] = useState(false)
	const [isLogin, setIsLogin] = useState(true)

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			{/* Кнопки, открывающие окно */}
			<Button
				variant='default'
				className='bg-indigo-600 hover:bg-indigo-700 text-white'
				onClick={() => setOpen(true)}
			>
				Начать обучение
			</Button>

			{/* Само окно авторизации */}
			<DialogContent className='sm:max-w-md bg-slate-900 border border-slate-700 text-slate-100'>
				<DialogHeader>
					<DialogTitle>
						{isLogin ? 'Вход в SafeNet' : 'Регистрация в SafeNet'}
					</DialogTitle>
					<DialogDescription className='text-slate-400'>
						{isLogin
							? 'Введите свои данные для входа в систему.'
							: 'Создайте аккаунт, чтобы начать обучение.'}
					</DialogDescription>
				</DialogHeader>

				<form
					className='space-y-4 mt-4'
					onSubmit={e => {
						e.preventDefault()
						setOpen(false)
					}}
				>
					{!isLogin && (
						<div>
							<Label htmlFor='name'>Имя</Label>
							<Input
								id='name'
								type='text'
								placeholder='Введите имя'
								className='bg-slate-800 border-slate-700'
							/>
						</div>
					)}
					<div>
						<Label htmlFor='email'>Email</Label>
						<Input
							id='email'
							type='email'
							placeholder='Введите email'
							className='bg-slate-800 border-slate-700'
						/>
					</div>
					<div>
						<Label htmlFor='password'>Пароль</Label>
						<Input
							id='password'
							type='password'
							placeholder='Введите пароль'
							className='bg-slate-800 border-slate-700'
						/>
					</div>

					<DialogFooter className='flex flex-col gap-3'>
						<Button
							type='submit'
							className='w-full bg-indigo-600 hover:bg-indigo-700 text-white'
						>
							{isLogin ? 'Войти' : 'Зарегистрироваться'}
						</Button>

						<button
							type='button'
							className='text-sm text-cyan-400 hover:underline'
							onClick={() => setIsLogin(!isLogin)}
						>
							{isLogin
								? 'Нет аккаунта? Зарегистрироваться'
								: 'Уже есть аккаунт? Войти'}
						</button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
