import { features } from '@/lib/data'
import { Sparkles } from 'lucide-react'

export default function Features() {
	return (
		<section id='features' className='py-20'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='text-center mb-16'>
					<h3 className='text-3xl sm:text-4xl font-bold text-white mb-4'>
						Почему SafeNet?
					</h3>
					<p className='text-lg text-slate-400 max-w-2xl mx-auto'>
						Современный подход к обучению кибербезопасности через игровые
						механики и реальные сценарии
					</p>
				</div>

				<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
					{features.map((feature, index) => {
						const Icon = feature.icon
						return (
							<div
								key={index}
								className='group relative bg-slate-800 hover:bg-slate-750 rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 overflow-hidden'
							>
								<div
									className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
								></div>

								<div className='absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
									<span
										className={`text-xs font-bold px-2 py-1 rounded-full bg-gradient-to-r ${feature.color} text-white`}
									>
										{feature.highlight}
									</span>
								</div>

								<div className='relative z-10'>
									<div
										className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}
									>
										<Icon className='w-7 h-7 text-white' strokeWidth={2} />
									</div>

									<h4 className='text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-slate-300 transition-all'>
										{feature.title}
									</h4>

									<p className='text-slate-400 text-sm leading-relaxed mb-4'>
										{feature.description}
									</p>

									<div className='flex items-center gap-2 pt-3 border-t border-slate-700 group-hover:border-slate-600 transition-colors'>
										<Sparkles className='w-4 h-4 text-indigo-400' />
										<span className='text-xs font-medium text-slate-500 group-hover:text-slate-400 transition-colors'>
											{feature.stats}
										</span>
									</div>
								</div>
							</div>
						)
					})}
				</div>

				<div className='mt-16 grid md:grid-cols-3 gap-6'>
					<div className='bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6 text-center'>
						<div className='text-4xl mb-3'>🎯</div>
						<h5 className='text-lg font-bold text-white mb-2'>Адаптивность</h5>
						<p className='text-sm text-slate-400'>
							Система автоматически подстраивает сложность под твой уровень
						</p>
					</div>

					<div className='bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center'>
						<div className='text-4xl mb-3'>📱</div>
						<h5 className='text-lg font-bold text-white mb-2'>Везде с тобой</h5>
						<p className='text-sm text-slate-400'>
							Учись с любого устройства: телефон, планшет или компьютер
						</p>
					</div>

					<div className='bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-6 text-center'>
						<div className='text-4xl mb-3'>⚡</div>
						<h5 className='text-lg font-bold text-white mb-2'>
							Регулярные обновления
						</h5>
						<p className='text-sm text-slate-400'>
							Новые уровни и задания каждый месяц на основе актуальных угроз
						</p>
					</div>
				</div>
			</div>
		</section>
	)
}
