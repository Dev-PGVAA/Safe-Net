import { Shield } from 'lucide-react'

export default function Footer() {
	return (
		<footer className='bg-slate-800/50 border-t border-slate-800 py-12'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='grid md:grid-cols-3 gap-8 mb-8'>
					<div>
						<div className='flex items-center gap-3 mb-4'>
							<div className='w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center'>
								<Shield className='w-6 h-6 text-white' />
							</div>
							<div>
								<h4 className='text-lg font-bold text-white'>SafeNet</h4>
								<p className='text-xs text-slate-400'>
									Учись. Играя. Защищайся.
								</p>
							</div>
						</div>
						<p className='text-sm text-slate-400 leading-relaxed'>
							Образовательная платформа по кибербезопасности для школьников
						</p>
					</div>

					<div>
						<h5 className='text-white font-semibold mb-4'>Навигация</h5>
						<div className='space-y-2'>
							<a
								href='#features'
								className='block text-sm text-slate-400 hover:text-white transition-colors'
							>
								Возможности
							</a>
							<a
								href='#topics'
								className='block text-sm text-slate-400 hover:text-white transition-colors'
							>
								Темы обучения
							</a>
							<a
								href='#stats'
								className='block text-sm text-slate-400 hover:text-white transition-colors'
							>
								Статистика
							</a>
						</div>
					</div>

					<div>
						<h5 className='text-white font-semibold mb-4'>Контакты</h5>
						<div className='space-y-2'>
							<p className='text-sm text-slate-400'>
								ГБОУ Школа № 1560 «Лидер»
							</p>
							<p className='text-sm text-slate-400'>Москва, 2025</p>
						</div>
					</div>
				</div>

				<div className='pt-8 border-t border-slate-700 text-center'>
					<p className='text-sm text-slate-500'>
						© 2025 SafeNet — проект учеников 10-2 класса ГБОУ Школа № 1560
						«Лидер»
					</p>
				</div>
			</div>
		</footer>
	)
}
