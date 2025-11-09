import { topics } from '@/lib/data'
import { ArrowRight } from 'lucide-react'

export default function Topics() {
	return (
		<section id='topics' className='py-20 bg-slate-800/30'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='text-center mb-16'>
					<h3 className='text-3xl sm:text-4xl font-bold text-white mb-4'>
						Темы обучения
					</h3>
					<p className='text-lg text-slate-400 max-w-2xl mx-auto'>
						Изучай различные аспекты кибербезопасности поэтапно
					</p>
				</div>

				<div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
					{topics.map((topic, index) => (
						<div
							key={index}
							className='bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-indigo-500/50 transition-all duration-300 group hover:shadow-xl hover:shadow-indigo-500/10'
						>
							<div className='flex items-center justify-between mb-4'>
								<div className='text-4xl'>{topic.icon}</div>
								<div className='text-sm text-slate-400'>
									{topic.tasks} заданий
								</div>
							</div>
							<h4 className='text-xl font-semibold text-white mb-3'>
								{topic.name}
							</h4>
							<div className='space-y-2'>
								<div className='flex items-center justify-between text-sm'>
									<span className='text-slate-400'>Прогресс</span>
									<span className='text-white font-semibold'>
										{topic.progress}%
									</span>
								</div>
								<div className='h-2 bg-slate-700 rounded-full overflow-hidden'>
									<div
										className='h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500'
										style={{ width: `${topic.progress}%` }}
									></div>
								</div>
							</div>
							<button className='w-full mt-4 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 group-hover:bg-indigo-600'>
								Продолжить
								<ArrowRight className='w-4 h-4' />
							</button>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
