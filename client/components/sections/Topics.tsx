import { topics } from '@/lib/data'

export default function Topics() {
	return (
		<section id='topics' className='py-24 bg-slate-800/30'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='text-center mb-16'>
					<h3 className='text-3xl sm:text-4xl font-bold text-white mb-4'>
						Этапы обучения
					</h3>
					<p className='text-lg text-slate-400 max-w-2xl mx-auto'>
						Изучай различные аспекты кибербезопасности поэтапно
					</p>
				</div>

				{/* Masonry-like grid */}
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[1fr]'>
					{topics.map((topic, index) => (
						<div
							key={index}
							className='bg-slate-800/60 rounded-2xl p-6 border border-slate-700
							hover:border-indigo-500/60 transition-all duration-300 group
							hover:shadow-xl hover:shadow-indigo-600/10 hover:-translate-y-1
							flex flex-col justify-between min-h-[180px]'
						>
							<div>
								<div className='flex items-center justify-between mb-4'>
									<div className='text-5xl drop-shadow-sm'>{topic.icon}</div>
									<div className='text-sm text-slate-400'>
										{topic.tasks} заданий
									</div>
								</div>

								<h4 className='text-xl font-semibold text-white tracking-wide'>
									{topic.name}
								</h4>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
