'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import * as LucideIcons from 'lucide-react'
import { useMemo, useState } from 'react'

const ICON_NAMES: string[] = [
	// Основное (Навигация и Обучение)
	'Shield', 'ShieldCheck', 'ShieldAlert', 'ShieldOff', // Безопасность
	'Lock', 'Unlock', 'Key', 'KeyRound', 'Fingerprint', // Доступ
	'BookOpen', 'GraduationCap', 'Library', 'School', // Образование
	'LayoutDashboard', 'Home', 'Settings', 'User', 'Users', // UI

	// Техническое (Кодинг и Сети)
	'Terminal', 'Code2', 'Cpu', 'Binary', 'Database', // Разработка
	'Network', 'Globe', 'Server', 'HardDrive', 'Wifi', // Инфраструктура
	'Bug', 'Venom', 'Skull', 'Zap', 'Flame', // Угрозы и вирусы
	'Scan', 'SearchCode', 'Activity', 'Radar', 'Eye', // Мониторинг

	// Аналитика и Файлы
	'FileCode', 'FileLock2', 'FileSearch', 'FileWarning', // Работа с файлом
	'BarChart3', 'LineChart', 'PieChart', 'History', // Статистика

	// Интерфейс (Действия)
	'Plus', 'Trash2', 'Edit3', 'Save', 'Download', 'Upload',
	'AlertTriangle', 'Info', 'CheckCircle2', 'XCircle',
	'ArrowRight', 'ChevronRight', 'ExternalLink', 'Share2',
	'Star', 'Bookmark', 'Flag', 'Bell'
].sort()


interface IconPickerProps {
	value?: string
	onValueChange: (value: string) => void
}

export function IconPicker({ value = 'BookOpen', onValueChange }: IconPickerProps) {
	const [open, setOpen] = useState(false)
	const [search, setSearch] = useState('')

	const SelectedIcon =
		(LucideIcons as any)[value] ||
		(LucideIcons as any)['CircleHelp'] ||
		(() => null)

	const filtered = useMemo(() => {
		const s = search.trim().toLowerCase()
		const base = s
			? ICON_NAMES.filter(name => name.toLowerCase().includes(s))
			: ICON_NAMES

		// 2. Жёсткий лимит на количество отображаемых иконок
		return base.slice(0, 200)
	}, [search])

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					type='button'
					variant='outline'
					role='combobox'
					aria-expanded={open}
					className='w-full justify-between bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white'
				>
					<div className='flex items-center gap-2'>
						<SelectedIcon className='w-4 h-4' />
						<span>{value || 'Выберите иконку'}</span>
					</div>
					<LucideIcons.ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>

			<PopoverContent
				className='w-[420px] p-0 bg-[#0A0F1D] border-white/10'
				align='start'
				onWheel={e => e.stopPropagation()}
			>
				<div className='flex flex-col'>
					<div className='border-b border-white/10 p-3'>
						<Input
							placeholder='Поиск иконки...'
							value={search}
							onChange={e => setSearch(e.target.value)}
							className='bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-10'
						/>
					</div>

					{filtered.length > 0 ? (
						<>
							<div className='max-h-[360px] overflow-y-auto'>
								<div className='grid grid-cols-8 gap-1 p-3'>
									{filtered.map(iconName => {
										const IconComp =
											(LucideIcons as any)[iconName] ||
											(LucideIcons as any)['CircleHelp']

										return (
											<button
												key={iconName}
												type='button'
												onClick={() => {
													onValueChange(iconName)
													setOpen(false)
													setSearch('')
												}}
												className={cn(
													'flex items-center justify-center p-3 rounded-lg transition-all duration-200',
													'hover:bg-white/10 active:scale-95',
													value === iconName
														? 'bg-purple-500/20 ring-1 ring-purple-500/50'
														: 'bg-white/[0.02]'
												)}
												title={iconName}
											>
												<IconComp
													className={cn(
														'w-5 h-5',
														value === iconName ? 'text-purple-400' : 'text-gray-300'
													)}
												/>
											</button>
										)
									})}
								</div>
							</div>

							<div className='border-t border-white/10 px-4 py-3 bg-white/[0.02]'>
								<p className='text-xs text-gray-400'>
									Показано {filtered.length} из {ICON_NAMES.length} иконок
								</p>
							</div>
						</>
					) : (
						<div className='text-center py-8 text-gray-400 text-sm'>
							Иконка не найдена
						</div>
					)}
				</div>
			</PopoverContent>
		</Popover>
	)
}
