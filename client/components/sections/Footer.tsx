import { Shield } from 'lucide-react'

export default function Footer() {
	return (
		<footer className='bg-slate-800/50 border-t border-slate-800 py-12'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='grid md:grid-cols-3 gap-8 mb-8'>
					<div>
						<div className='flex items-center gap-3 mb-4'>
							<div className='w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center'>
								<Shield className='w-6 h-6 text-white' />
							</div>
							<div>
								<h4 className='text-lg font-bold text-white'>SafeNet</h4>
								<p className='text-xs text-slate-400'>
									Learn. Play. Stay Safe.
								</p>
							</div>
						</div>
						<p className='text-sm text-slate-400 leading-relaxed'>
							A cybersecurity education platform for schoolkids
						</p>
					</div>
					<div>
						<h5 className='text-white font-semibold mb-4'>Navigation</h5>
						<div className='space-y-2'>
							<a
								href='#features'
								className='block text-sm text-slate-400 hover:text-white transition-colors'
							>
								Features
							</a>
							<a
								href='#topics'
								className='block text-sm text-slate-400 hover:text-white transition-colors'
							>
								Learning Topics
							</a>
							<a
								href='#stats'
								className='block text-sm text-slate-400 hover:text-white transition-colors'
							>
								Statistics
							</a>
						</div>
					</div>
					<div>
						<h5 className='text-white font-semibold mb-4'>Contact</h5>
						<div className='space-y-2'>
							<p className='text-sm text-slate-400'>
								SafeNet Team
							</p>
							<p className='text-sm text-slate-400'>Moscow, 2025</p>
						</div>
					</div>
				</div>
				<div className='pt-8 border-t border-slate-700 text-center'>
					<p className='text-sm text-slate-500'>
						© 2025 SafeNet — Cybersecurity Education Platform
					</p>
				</div>
			</div>
		</footer>
	)
}
