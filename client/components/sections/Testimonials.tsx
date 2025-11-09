'use client'

import { testimonials } from '@/lib/data'
import { Star } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Testimonials() {
	const [activeTestimonial, setActiveTestimonial] = useState(0)

	useEffect(() => {
		const timer = setInterval(() => {
			setActiveTestimonial(prev => (prev + 1) % testimonials.length)
		}, 5000)
		return () => clearInterval(timer)
	}, [])

	return (
		<section className='py-20 bg-slate-800/30'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='text-center mb-16'>
					<h3 className='text-3xl sm:text-4xl font-bold text-white mb-4'>
						Отзывы учеников
					</h3>
					<p className='text-lg text-slate-400'>
						Что говорят те, кто уже прошёл обучение
					</p>
				</div>

				<div className='relative max-w-4xl mx-auto'>
					<div className='bg-slate-800 rounded-2xl p-8 md:p-12 border border-slate-700 shadow-xl'>
						<div className='flex gap-1 mb-6 justify-center'>
							{[...Array(testimonials[activeTestimonial].rating)].map(
								(_, i) => (
									<Star
										key={i}
										className='w-5 h-5 text-yellow-500 fill-yellow-500'
									/>
								)
							)}
						</div>
						<p className='text-xl text-slate-200 text-center mb-6 leading-relaxed italic'>
							&quot;{testimonials[activeTestimonial].text}&quot;
						</p>
						<p className='text-center text-slate-400 font-medium'>
							— {testimonials[activeTestimonial].author}
						</p>
					</div>

					<div className='flex items-center justify-center gap-2 mt-6'>
						{testimonials.map((_, index) => (
							<button
								key={index}
								onClick={() => setActiveTestimonial(index)}
								className={`h-2 rounded-full transition-all ${
									index === activeTestimonial
										? 'w-8 bg-indigo-500'
										: 'w-2 bg-slate-600 hover:bg-slate-500'
								}`}
							/>
						))}
					</div>
				</div>
			</div>
		</section>
	)
}
