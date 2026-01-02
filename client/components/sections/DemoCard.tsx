'use client'
import { m } from 'framer-motion'

import {
	Activity,
	BarChart3,
	BookOpen,
	CheckCircle,
	ClipboardList,
	FishingHook,
	Key,
	Lock,
	Shield,
	ShieldCheck,
	X,
	XCircle,
	Zap,
} from 'lucide-react'

import { useState } from 'react'

export default function DemoCard() {
	const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
	const [showModal, setShowModal] = useState(false)
	const handleSafeClick = () => setIsCorrect(false)
	const handleDangerClick = () => setIsCorrect(true)
	const openModal = () => setShowModal(true)
	const closeModal = () => setShowModal(false)
	return (
		<m.div
			initial={{ opacity: 0, x: 100 }}
			whileInView={{ opacity: 1, x: 0 }}
			viewport={{ once: true, amount: 0.3 }}
			transition={{ duration: 0.8, ease: [0.25, 0.8, 0.25, 1] }}
			className='relative'
		>
			{}
			<div className='absolute inset-0 bg-linear-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-2xl'></div>
			{}
			<div className='relative bg-slate-800 rounded-2xl shadow-2xl p-6 border border-slate-700'>
				<div className='flex items-center justify-between mb-4'>
					<div>
						<h3 className='font-semibold text-white text-lg'>
							Уровень 1: Фишинг
						</h3>
						<p className='text-xs text-slate-400'>
							Определи, безопасна ли ссылка
						</p>
					</div>
					<div className='w-12 h-12 bg-linear-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center'>
						<FishingHook className='w-7 h-7 text-white' />
					</div>
				</div>
				<div className='bg-slate-900/50 rounded-xl p-4 mb-4 border border-slate-700'>
					<p className='text-sm text-slate-200 mb-2'>
						<span className='text-slate-400'>Отправитель:</span>{' '}
						<a href='mailto:support@bank-pay.com' className='underline'>
							support@bank-pay.com
						</a>
					</p>
					<p className='text-sm text-slate-400'>
						&quot;Ваш счет будет закрыт. Подтвердите личность немедленно.&quot;
					</p>
				</div>
				{isCorrect !== null && (
					<m.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4 }}
						className={`mb-4 p-3 rounded-xl flex items-center gap-2 ${
							isCorrect
								? 'bg-emerald-900/30 border border-emerald-700'
								: 'bg-rose-900/30 border border-rose-700'
						}`}
					>
						{isCorrect ? (
							<CheckCircle className='w-5 h-5 text-emerald-400' />
						) : (
							<XCircle className='w-5 h-5 text-rose-400' />
						)}
						<span
							className={`text-sm ${isCorrect ? 'text-emerald-200' : 'text-rose-200'}`}
						>
							{isCorrect
								? 'Правильно! Это фишинг. Обратите внимание на подозрительный домен.'
								: 'Неправильно. Это фишинговое письмо.'}
						</span>
					</m.div>
				)}
				<div className='grid grid-cols-2 gap-3'>
					<button
						className={`${
							isCorrect === false
								? 'bg-rose-900/50 border-rose-500 text-rose-200'
								: 'bg-emerald-900/30 hover:bg-emerald-900/50 border-emerald-700 text-emerald-200'
						} px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2`}
						onClick={handleSafeClick}
						disabled={isCorrect !== null}
					>
						<CheckCircle className='w-4 h-4' />
						Безопасно
					</button>
					<button
						className={`${
							isCorrect === true
								? 'bg-emerald-900/50 border-emerald-500 text-emerald-200'
								: 'bg-rose-900/30 hover:bg-rose-900/50 border-rose-700 text-rose-200'
						} px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2`}
						onClick={handleDangerClick}
						disabled={isCorrect !== null}
					>
						<XCircle className='w-4 h-4' />
						Опасно
					</button>
				</div>
				{isCorrect === null && (
					<m.div
						initial={{ opacity: 0, y: 10 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.3 }}
						className='mt-4 flex items-start gap-2 text-xs text-slate-500 bg-slate-900/30 rounded-lg p-3'
					>
						<Zap className='w-4 h-4 text-yellow-500 shrink-0 mt-0.5' />
						<span>
							Подсказка: Проверь адрес отправителя на наличие ошибок в домене.
						</span>
					</m.div>
				)}
				{}
				{isCorrect !== null && (
					<div className='mt-4'>
						<button
							onClick={openModal}
							className='w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg hover:scale-[1.01] transition-transform'
						>
							<BookOpen className='w-4 h-4' />
							Пройти ещё — обзор по безопасности паролей
						</button>
					</div>
				)}
				{}
				{showModal && <PasswordModal onClose={closeModal} />}
			</div>
		</m.div>
	)
}
function PasswordModal({ onClose }: { onClose: () => void }) {
	const [tab, setTab] = useState<'theory' | 'practice' | 'quiz'>('theory')
	const [completedTasks, setCompletedTasks] = useState<Record<number, boolean>>(
		{}
	)
	const [quizState, setQuizState] = useState({
		current: 0,
		answers: {} as Record<number, number>,
		submitted: false,
	})
	const tasks = [
		'Составить 3 устойчивых пароля (12+ символов) и проверить их в менеджере паролей',
		'Включить двухфакторную аутентификацию в одном сервисе',
		'Проверить, используются ли повторно старые пароли',
		'Настроить автоматическую смену паролей раз в 3-6 месяцев',
		'Проверить, есть ли у ваших аккаунтов утечки через HaveIBeenPwned',
		'Настроить уведомления о подозрительной активности',
	]
	const quiz = [
		{
			q: 'Какой алгоритм хэширования сейчас считается лучшей практикой для паролей?',
			options: ['MD5', 'bcrypt / Argon2', 'SHA1', 'Plain text'],
			correct: 1,
		},
		{
			q: 'Что такое "соль" (salt) в контексте хранения паролей?',
			options: [
				'Секретный ключ, доступный только администратору',
				'Уникальная добавка к каждому паролю перед хэшированием',
				'Вид менеджера паролей',
				'Алгоритм шифрования',
			],
			correct: 1,
		},
		{
			q: 'Какова минимальная рекомендуемая длина пароля?',
			options: ['6 символов', '8 символов', '10 символов', '12 символов'],
			correct: 3,
		},
		{
			q: 'Какой из следующих паролей наиболее безопасен?',
			options: ['123456', 'password123', 'P@ssw0rd!', 'Xv2#kL9!nQz7@pR'],
			correct: 3,
		},
		{
			q: 'Что из следующего НЕ является хорошей практикой для паролей?',
			options: [
				'Использование менеджера паролей',
				'Повторное использование одного пароля для всех аккаунтов',
				'Использование длинных, сложных паролей',
				'Регулярная смена паролей',
			],
			correct: 1,
		},
		{
			q: 'Какой тип аутентификации добавляет дополнительный уровень безопасности?',
			options: [
				'Только пароль',
				'Двухфакторная аутентификация (2FA)',
				'Запоминание пароля в браузере',
				'Хранение паролей в текстовом файле',
			],
			correct: 1,
		},
		{
			q: 'Какой из следующих символов НЕ увеличивает сложность пароля?',
			options: ['!', '@', '#', 'Пробел'],
			correct: 3,
		},
		{
			q: 'Почему важно использовать уникальные пароли для каждого аккаунта?',
			options: [
				'Это делает пароли легче запоминаемыми',
				'Это предотвращает цепочку взломов при утечке одного аккаунта',
				'Это ускоряет вход в систему',
				'Это снижает нагрузку на серверы',
			],
			correct: 1,
		},
	]
	const stats = [
		{ label: 'Средняя длина паролей', value: '8.2', icon: BarChart3 },
		{ label: 'Повторяющиеся пароли', value: '42%', icon: Activity },
		{ label: 'Слабые пароли', value: '28%', icon: Shield },
		{ label: 'Утечки аккаунтов', value: '7', icon: Key },
	]
	const bestPractices = [
		{
			title: 'Используйте менеджер паролей',
			desc: 'Храните уникальные, сложные пароли для каждого аккаунта без необходимости их запоминать',
			icon: Lock,
		},
		{
			title: 'Двухфакторная аутентификация',
			desc: 'Добавьте дополнительный уровень защиты с помощью SMS, приложений или аппаратных токенов',
			icon: Shield,
		},
		{
			title: 'Регулярная смена паролей',
			desc: 'Меняйте пароли раз в 3-6 месяцев, особенно для важных аккаунтов',
			icon: Activity,
		},
		{
			title: 'Сложные комбинации',
			desc: 'Используйте минимум 12 символов, включая заглавные/строчные буквы, цифры и символы',
			icon: Key,
		},
	]
	const toggleTask = (i: number) => {
		setCompletedTasks(prev => ({ ...prev, [i]: !prev[i] }))
	}
	const selectAnswer = (qIdx: number, optIdx: number) => {
		if (quizState.submitted) return
		setQuizState(s => ({ ...s, answers: { ...s.answers, [qIdx]: optIdx } }))
	}
	const submitQuiz = () => {
		setQuizState(s => ({ ...s, submitted: true }))
	}
	const score = () => {
		let s = 0
		quiz.forEach((q, i) => {
			if (quizState.answers[i] === q.correct) s++
		})
		return s
	}
	const toggleTab = (newTab: 'theory' | 'practice' | 'quiz') => {
		setTab(newTab)
	}
	const downloadCheatsheet = () => {
		const text = `Шпаргалка по безопасности паролей:\n- Используйте Argon2/bcrypt\n- Солите + пеппер (если нужно)\n- Минимум 12 символов\n- Менеджер паролей + MFA\n- Не повторяйте пароли\n- Регулярно меняйте их\n`
		const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = 'password_cheatsheet.txt'
		a.click()
		URL.revokeObjectURL(url)
	}
	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
			{}
			<div
				className='absolute inset-0 bg-black/50 backdrop-blur-sm'
				onClick={onClose}
				aria-hidden
			></div>
			{}
			<m.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.25 }}
				className='relative z-60 w-[min(1200px,96%)] max-w-[1200px] rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden'
				role='dialog'
				aria-modal='true'
			>
				{}
				<div className='flex items-center justify-between p-5 bg-linear-to-r from-indigo-600 to-purple-600'>
					<div className='flex items-center gap-3'>
						<ShieldCheck className='w-6 h-6 text-white' />
						<div>
							<h4 className='text-white font-semibold'>
								Обзор: Безопасность паролей
							</h4>
							<p className='text-xs text-indigo-100/80'>
								Краткая теория → практика → проверка знаний
							</p>
						</div>
					</div>
					<div className='flex items-center gap-3'>
						<button
							onClick={onClose}
							className='p-2 rounded-lg bg-white/6 hover:bg-white/10 text-white'
							aria-label='Закрыть модальное окно'
						>
							<X className='w-4 h-4' />
						</button>
					</div>
				</div>
				{}
				<div className='flex gap-6 p-6 h-[70vh]'>
					{}
					<div className='w-60 shrink-0'>
						<nav className='flex flex-col gap-2'>
							<button
								onClick={() => toggleTab('theory')}
								className={`w-full text-left px-3 py-2 rounded-xl ${
									tab === 'theory'
										? 'bg-slate-800/60 text-white'
										: 'text-slate-300 hover:bg-slate-800/30'
								}`}
							>
								<div className='flex items-center gap-2'>
									<BookOpen className='w-4 h-4' />
									<span className='text-sm'>Теория</span>
								</div>
							</button>
							<button
								onClick={() => toggleTab('practice')}
								className={`w-full text-left px-3 py-2 rounded-xl ${
									tab === 'practice'
										? 'bg-slate-800/60 text-white'
										: 'text-slate-300 hover:bg-slate-800/30'
								}`}
							>
								<div className='flex items-center gap-2'>
									<ClipboardList className='w-4 h-4' />
									<span className='text-sm'>Закрепление</span>
								</div>
							</button>
							<button
								onClick={() => toggleTab('quiz')}
								className={`w-full text-left px-3 py-2 rounded-xl ${
									tab === 'quiz'
										? 'bg-slate-800/60 text-white'
										: 'text-slate-300 hover:bg-slate-800/30'
								}`}
							>
								<div className='flex items-center gap-2'>
									<CheckCircle className='w-4 h-4' />
									<span className='text-sm'>Тест</span>
								</div>
							</button>
						</nav>
						<div className='mt-6 text-xs text-slate-400'>
							Рекомендуемое время:{' '}
							<strong className='text-white'>15–30 минут</strong>
						</div>
					</div>
					{}
					<div className='flex-1 min-h-[400px] overflow-y-auto pr-2'>
						{}
						{tab === 'theory' && (
							<div className='space-y-6 text-slate-200 pb-4'>
								<h5 className='text-xl font-semibold'>Ключевая теория</h5>
								<p className='text-sm leading-relaxed'>
									Пароли — это первая линия защиты ваших данных. Основные
									практики: использовать уникальные длинные пароли (12+
									символов), менеджеры паролей, включать многофакторную
									аутентификацию (MFA), и хранить пароли в виде хэшей с солью и
									адаптивным алгоритмом (bcrypt/Argon2).
								</p>
								<div className='grid grid-cols-2 gap-4'>
									<div className='bg-slate-800/40 p-4 rounded-xl border border-slate-700'>
										<h6 className='font-medium text-sm flex items-center gap-2'>
											<Lock className='w-4 h-4' /> Хэширование
										</h6>
										<p className='text-xs text-slate-300 mt-2'>
											Используйте медленные адаптивные функции хэширования
											(Argon2, bcrypt). Никогда не храните пароль в открытом
											виде. Это предотвращает утечки даже при взломе базы
											данных.
										</p>
									</div>
									<div className='bg-slate-800/40 p-4 rounded-xl border border-slate-700'>
										<h6 className='font-medium text-sm flex items-center gap-2'>
											<Key className='w-4 h-4' /> Соль и Пеппер
										</h6>
										<p className='text-xs text-slate-300 mt-2'>
											Соль — уникальная случайная строка для каждого пароля.
											Пеппер — глобальный секрет, хранящийся отдельно (не
											обязателен, но усиливает безопасность).
										</p>
									</div>
								</div>
								<div className='mt-6'>
									<h6 className='font-medium text-sm mb-3'>
										Статистика по безопасности паролей
									</h6>
									<div className='grid grid-cols-2 gap-3'>
										{stats.map((stat, i) => (
											<div
												key={i}
												className='bg-slate-800/30 p-3 rounded-lg border border-slate-700'
											>
												<div className='flex items-center gap-2'>
													<stat.icon className='w-4 h-4 text-indigo-400' />
													<span className='text-xs text-slate-300'>
														{stat.label}
													</span>
												</div>
												<div className='text-lg font-bold text-white mt-1'>
													{stat.value}
												</div>
											</div>
										))}
									</div>
								</div>
								<div className='mt-6'>
									<h6 className='font-medium text-sm mb-3'>Лучшие практики</h6>
									<div className='grid grid-cols-2 gap-3'>
										{bestPractices.map((practice, i) => (
											<div
												key={i}
												className='bg-slate-800/30 p-4 rounded-lg border border-slate-700'
											>
												<div className='flex items-center gap-2 mb-2'>
													<practice.icon className='w-4 h-4 text-indigo-400' />
													<span className='text-sm font-medium'>
														{practice.title}
													</span>
												</div>
												<p className='text-xs text-slate-300'>
													{practice.desc}
												</p>
											</div>
										))}
									</div>
								</div>
							</div>
						)}
						{}
						{tab === 'practice' && (
							<div className='space-y-4 text-slate-200 pb-4'>
								<h5 className='text-xl font-semibold'>Практические задания</h5>
								<p className='text-sm text-slate-300 mb-4'>
									Выполни задания и отмечай галочками — это улучшит навыки.
								</p>
								<ul className='space-y-3'>
									{tasks.map((t, i) => (
										<li
											key={i}
											className='flex items-start gap-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700'
										>
											<input
												id={`task-${i}`}
												checked={!!completedTasks[i]}
												onChange={() => toggleTask(i)}
												type='checkbox'
												className='w-4 h-4 rounded mt-0.5'
											/>
											<label
												htmlFor={`task-${i}`}
												className='text-sm text-slate-200 flex-1'
											>
												{t}
											</label>
										</li>
									))}
								</ul>
								<div className='pt-3'>
									<button
										onClick={() =>
											alert('Отлично! Продолжай в боевом проекте!')
										}
										className='px-4 py-2 rounded-xl bg-emerald-600 text-white'
									>
										Пометить всё как выполненное
									</button>
								</div>
							</div>
						)}
						{}
						{tab === 'quiz' && (
							<div className='space-y-4 text-slate-200 pb-4'>
								<h5 className='text-xl font-semibold'>Короткий тест</h5>
								<p className='text-sm text-slate-300 mb-4'>
									Выбери ответы и нажми &quot;Отправить&quot; для проверки.
								</p>
								<div className='space-y-6'>
									{quiz.map((q, i) => (
										<div
											key={i}
											className='bg-slate-800/30 p-4 rounded-xl border border-slate-700'
										>
											<div className='text-sm font-medium mb-3'>
												{i + 1}. {q.q}
											</div>
											<div className='grid gap-2'>
												{q.options.map((opt, j) => {
													const selected = quizState.answers[i] === j
													const isCorrect =
														quizState.submitted && q.correct === j
													const isWrong =
														quizState.submitted && selected && q.correct !== j
													return (
														<button
															key={j}
															onClick={() => selectAnswer(i, j)}
															disabled={quizState.submitted}
															className={`w-full text-left px-3 py-3 rounded-lg ${
																selected
																	? 'ring-1 ring-offset-1 ring-indigo-400 bg-indigo-900/20'
																	: 'hover:bg-slate-800/20'
															} ${
																isCorrect
																	? 'bg-emerald-800/40 border border-emerald-600'
																	: isWrong
																		? 'bg-rose-800/40 border border-rose-600'
																		: 'border border-slate-700'
															}`}
														>
															<div className='flex items-center gap-3'>
																<div className='w-5 h-5 flex items-center justify-center rounded border'>
																	{selected ? '●' : '○'}
																</div>
																<div className='text-sm'>{opt}</div>
															</div>
														</button>
													)
												})}
											</div>
										</div>
									))}
									<div className='flex items-center gap-3 pt-4'>
										<button
											onClick={submitQuiz}
											disabled={quizState.submitted}
											className='px-4 py-2 rounded-xl bg-indigo-600 text-white'
										>
											Отправить
										</button>
										{quizState.submitted && (
											<div className='text-sm'>
												Результат:{' '}
												<strong>
													{score()} / {quiz.length}
												</strong>
											</div>
										)}
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
				{}
				<div className='p-4 border-t border-slate-800 flex items-center justify-between'>
					<div className='text-xs text-slate-400'>
						Совет: после теории обязательно попробуйте задания и тест.
					</div>
					<div className='flex items-center gap-3'>
						<button
							onClick={onClose}
							className='px-4 py-2 rounded-xl bg-white/6 text-white'
						>
							Закрыть
						</button>
					</div>
				</div>
			</m.div>
		</div>
	)
}
