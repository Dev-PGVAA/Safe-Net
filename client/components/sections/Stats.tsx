import { BookOpen, CheckCircle, Target, Users } from 'lucide-react'

const stats = [
	{ label: 'Активных пользователей', value: '1,240+', icon: Users },
	{ label: 'Пройдено заданий', value: '15,000+', icon: CheckCircle },
	{ label: 'Средняя точность', value: '82%', icon: Target },
	{ label: 'Уроков доступно', value: '300+', icon: BookOpen },
]

export default function Stats() {
	return (
		<section id='stats' className='py-16 bg-slate-800/30'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='grid grid-cols-2 lg:grid-cols-4 gap-6'>
					{stats.map((stat, index) => {
						const Icon = stat.icon
						return (
							<div key={index} className='text-center'>
								<div className='w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3'>
									<Icon className='w-6 h-6 text-white' />
								</div>
								<div className='text-3xl font-bold text-white mb-1'>
									{stat.value}
								</div>
								<div className='text-sm text-slate-400'>{stat.label}</div>
							</div>
						)
					})}
				</div>
			</div>
		</section>
	)
}
