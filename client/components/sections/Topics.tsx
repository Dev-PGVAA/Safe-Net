'use client'

import { topics } from '@/lib/data'
import { motion } from 'framer-motion'

export default function Topics() {
	return (
		<section id='topics' className='py-20 bg-slate-800/30'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='text-center mb-14'>
					<h3 className='text-3xl sm:text-4xl font-bold text-white mb-4'>
						Этапы обучения
					</h3>
					<p className='text-lg text-slate-400 max-w-2xl mx-auto'>
						Изучай различные аспекты кибербезопасности поэтапно
					</p>
				</div>

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
					{topics.map((topic, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 30, scale: 0.95 }}
							whileInView={{ opacity: 1, y: 0, scale: 1 }}
							viewport={{ once: true }}
							transition={{
								duration: 0.5,
								delay: index * 0.1,
								ease: [0.25, 0.8, 0.25, 1],
							}}
						>
							<div
								className='relative overflow-hidden bg-slate-800/70 rounded-xl p-5 border border-slate-700
								group transition-all duration-500 ease-out
								hover:border-transparent hover:shadow-2xl hover:shadow-indigo-500/25
								hover:-translate-y-3 hover:scale-[1.03]
								hover:bg-gradient-to-br hover:from-slate-800/80 hover:to-slate-700/60
								min-h-[150px]'
							>
								{/* Glow background */}
								<div
									className='absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 blur-2xl'
									style={{
										background: `radial-gradient(circle at top right, ${topic.strokeColor}B0 0%, transparent 70%)`,
									}}
								></div>

								<div className='relative flex flex-col justify-between h-full'>
									<div>
										<div className='flex items-center justify-between mb-3'>
											<motion.div
												whileHover={{
													rotate: [0, 5, -5, 0],
													scale: 1.15,
													transition: { duration: 0.5 },
												}}
												className='text-5xl drop-shadow-sm'
											>
												<topic.icon size={34} stroke={topic.strokeColor} />
											</motion.div>
											<div className='text-sm text-slate-400'>
												{topic.tasks} заданий
											</div>
										</div>

										<h4 className='text-lg font-semibold text-white tracking-wide group-hover:text-indigo-300 transition-colors duration-300'>
											{topic.name}
										</h4>
									</div>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	)
}
