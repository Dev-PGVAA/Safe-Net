import { memo } from 'react'

export const AppleLoadingGrid = memo(() => {
	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
			{[1, 2, 3, 4, 5, 6].map(i => (
				<div
					key={i}
					className='relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 h-64'
				>
					<div className='absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/10 to-transparent' />
					<div className='p-6 md:p-8 space-y-6'>
						<div className='space-y-3'>
							<div className='h-6 w-24 bg-white/10 rounded-full' />
							<div className='h-8 w-3/4 bg-white/10 rounded-lg' />
						</div>
						<div className='space-y-2'>
							<div className='h-4 w-full bg-white/10 rounded' />
							<div className='h-2 w-full bg-white/10 rounded-full' />
						</div>
					</div>
				</div>
			))}
		</div>
	)
})
AppleLoadingGrid.displayName = 'AppleLoadingGrid'
