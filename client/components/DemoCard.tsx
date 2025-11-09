import { Zap } from 'lucide-react'

export default function DemoCard() {
	return (
		<div className='relative'>
			<div className='absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-2xl'></div>
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
					<div className='w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-2xl'>
						🎣
					</div>
				</div>

				<div className='bg-slate-900/50 rounded-xl p-4 mb-4 border border-slate-700'>
					<p className='text-sm text-slate-200 mb-2'>
						<span className='text-slate-400'>Отправитель:</span>{' '}
						support@bank-pay.com
					</p>
					<p className='text-sm text-slate-400'>
						&quat;Ваш счет будет закрыт. Подтвердите личность немедленно.&quat;
					</p>
				</div>

				<div className='grid grid-cols-2 gap-3'>
					<button className='bg-emerald-900/30 hover:bg-emerald-900/50 border border-emerald-700 text-emerald-200 px-4 py-3 rounded-xl text-sm font-medium transition-all'>
						✅ Безопасно
					</button>
					<button className='bg-rose-900/30 hover:bg-rose-900/50 border border-rose-700 text-rose-200 px-4 py-3 rounded-xl text-sm font-medium transition-all'>
						🚨 Опасно
					</button>
				</div>

				<div className='mt-4 flex items-start gap-2 text-xs text-slate-500 bg-slate-900/30 rounded-lg p-3'>
					<Zap className='w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5' />
					<span>
						Подсказка: Проверь адрес отправителя на наличие ошибок в домене
					</span>
				</div>
			</div>
		</div>
	)
}
