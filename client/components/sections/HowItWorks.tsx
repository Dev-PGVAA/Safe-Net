import {
	BookOpen,
	Brain,
	FishingHook,
	Lock,
	MessageCircle,
	ShoppingBag,
	Target,
} from 'lucide-react'

const steps = [
	{
		step: '1',
		title: 'Обучение',
		description: 'Краткие карточки с правилами и примерами угроз',
		icon: BookOpen,
	},
	{
		step: '2',
		title: 'Практика',
		description: 'Интерактивные задания и реалистичные симуляции',
		icon: Target,
	},
	{
		step: '3',
		title: 'Анализ',
		description: 'Подробные пояснения после каждого задания',
		icon: Brain,
	},
]
const topicCards = [
	{
		name: 'Фишинг',
		icon: FishingHook,
		color: 'from-orange-500 to-red-600',
	},
	{
		name: 'Пароли',
		icon: Lock,
		color: 'from-emerald-500 to-teal-600',
	},
	{
		name: 'Соцсети',
		icon: MessageCircle,
		color: 'from-blue-500 to-cyan-600',
	},
	{
		name: 'Покупки',
		icon: ShoppingBag,
		color: 'from-purple-500 to-pink-600',
	},
]
export default function HowItWorks() {
	return (
		<section className='py-20'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='grid lg:grid-cols-2 gap-12 items-center'>
					<div>
						<h3 className='text-3xl sm:text-4xl font-bold text-white mb-6'>
							Как это работает
						</h3>
						<p className='text-lg text-slate-400 mb-8'>
							SafeNet сочетает теорию и практику для эффективного обучения
							кибербезопасности
						</p>
						<div className='space-y-6'>
							{steps.map((item, index) => {
								const Icon = item.icon
								return (
									<div key={index} className='flex gap-4 items-start'>
										<div className='shrink-0 w-12 h-12 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center'>
											<span className='text-white font-bold text-lg'>
												{item.step}
											</span>
										</div>
										<div className='flex-1'>
											<div className='flex items-center gap-2 mb-2'>
												<Icon className='w-5 h-5 text-indigo-400' />
												<h4 className='text-lg font-semibold text-white'>
													{item.title}
												</h4>
											</div>
											<p className='text-slate-400 text-sm leading-relaxed'>
												{item.description}
											</p>
										</div>
									</div>
								)
							})}
						</div>
					</div>
					<div className='relative'>
						<div className='absolute inset-0 bg-linear-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-2xl'></div>
						<div className='relative bg-slate-800 rounded-2xl p-6 border border-slate-700'>
							<div className='grid grid-cols-2 gap-4'>
								{topicCards.map((item, index) => {
									const Icon = item.icon
									return (
										<div
											key={index}
											className='bg-slate-900/50 hover:bg-slate-900 rounded-xl p-4 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer group'
										>
											<div
												className={`w-12 h-12 bg-linear-to-br ${item.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
											>
												<Icon className='w-6 h-6 text-white' />
											</div>
											<div className='font-semibold text-white text-sm'>
												{item.name}
											</div>
											<div className='text-xs text-slate-400 mt-1'>
												Изучить тему
											</div>
										</div>
									)
								})}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
