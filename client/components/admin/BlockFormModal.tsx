function BlockFormModal({
	lessonId,
	block,
	onClose,
	onSubmit,
	isEditing,
}: BlockFormModalProps) {
	const textareaRef = React.useRef<HTMLTextAreaElement>(null)

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors },
	} = useForm({
		defaultValues: {
			order: block?.order || 1,
			title: block?.title || '',
			content: block?.content || '',
		},
	})

	const content = watch('content') as string

	// Функция для вставки markdown синтаксиса
	const insertMarkdown = (before: string, after: string = '', placeholder: string = 'текст') => {
		const textarea = textareaRef.current
		if (!textarea) return

		const start = textarea.selectionStart
		const end = textarea.selectionEnd
		const selectedText = content.substring(start, end) || placeholder
		const newText = content.substring(0, start) + before + selectedText + after + content.substring(end)

		setValue('content', newText)

		// Возвращаем фокус и выделяем вставленный текст
		setTimeout(() => {
			textarea.focus()
			textarea.setSelectionRange(
				start + before.length,
				start + before.length + selectedText.length
			)
		}, 0)
	}

	const toolbarButtons = [
		{
			icon: <span className="font-bold text-lg">H1</span>,
			label: 'Заголовок 1',
			action: () => insertMarkdown('# ', '', 'Заголовок'),
		},
		{
			icon: <span className="font-bold">H2</span>,
			label: 'Заголовок 2',
			action: () => insertMarkdown('## ', '', 'Заголовок'),
		},
		{
			icon: <span className="font-bold text-sm">H3</span>,
			label: 'Заголовок 3',
			action: () => insertMarkdown('### ', '', 'Заголовок'),
		},
		{
			icon: <span className="font-bold">B</span>,
			label: 'Жирный',
			action: () => insertMarkdown('**', '**', 'жирный текст'),
		},
		{
			icon: <span className="italic">I</span>,
			label: 'Курсив',
			action: () => insertMarkdown('*', '*', 'курсив'),
		},
		{
			icon: <span className="line-through">S</span>,
			label: 'Зачеркнутый',
			action: () => insertMarkdown('~~', '~~', 'зачеркнутый'),
		},
		{
			icon: <span className="font-mono text-sm">&lt;/&gt;</span>,
			label: 'Код',
			action: () => insertMarkdown('`', '`', 'код'),
		},
		{
			icon: <span className="font-mono text-xs">```</span>,
			label: 'Блок кода',
			action: () => insertMarkdown('```\n', '\n```', 'код'),
		},
		{
			icon: <span>•</span>,
			label: 'Список',
			action: () => insertMarkdown('- ', '', 'элемент списка'),
		},
		{
			icon: <span>1.</span>,
			label: 'Нумерованный список',
			action: () => insertMarkdown('1. ', '', 'элемент списка'),
		},
		{
			icon: <span>"</span>,
			label: 'Цитата',
			action: () => insertMarkdown('> ', '', 'цитата'),
		},
		{
			icon: <span>🔗</span>,
			label: 'Ссылка',
			action: () => insertMarkdown('[', '](url)', 'текст ссылки'),
		},
	]

	return (
		<m.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className='fixed inset-0 z- bg-[#0A0F1D] overflow-y-auto'
		>
			{/* Header */}
			<div className='sticky top-0 border-b border-white/10 bg-[#0A0F1D]/95 backdrop-blur-xl z-10'>
				<div className='mx-auto flex max-w-7xl items-center justify-between px-6 py-4'>
					<div>
						<h3 className='text-2xl font-bold text-white'>
							{isEditing ? 'Редактировать блок теории' : 'Добавить блок теории'}
						</h3>
						<p className='mt-1 text-sm text-gray-500'>
							{isEditing
								? 'Измените параметры блока'
								: 'Создайте теоретический материал для урока'}
						</p>
					</div>
					<button
						onClick={onClose}
						className='rounded-xl bg-white/5 p-3 text-gray-400 transition-colors hover:bg-white/10 hover:text-white'
					>
						<X className='h-5 w-5' />
					</button>
				</div>
			</div>

			{/* Content */}
			<div className='mx-auto max-w-7xl px-6 py-8'>
				<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
					<div className='grid gap-6 md:grid-cols-2'>
						<div>
							<label className='mb-2 block text-sm font-semibold text-white'>
								Порядковый номер
							</label>
							<input
								{...register('order', { valueAsNumber: true })}
								type='number'
								className='w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors focus:border-purple-500/50 focus:bg-white/10'
								placeholder='1'
							/>
						</div>

						<div>
							<label className='mb-2 block text-sm font-semibold text-white'>
								Заголовок блока
							</label>
							<input
								{...register('title')}
								className='w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors focus:border-purple-500/50 focus:bg-white/10'
								placeholder='Введение в кибербезопасность'
							/>
						</div>
					</div>

					<div className='space-y-3'>
						<label className='mb-2 block text-sm font-semibold text-white'>
							Содержание (Markdown)
						</label>

						<div className='grid gap-4 md:grid-cols-2'>
							{/* Editor */}
							<div className='flex flex-col rounded-2xl border border-white/10 bg-white/5'>
								{/* Toolbar */}
								<div className='flex flex-wrap items-center gap-1 border-b border-white/10 p-2'>
									{toolbarButtons.map((button, index) => (
										<button
											key={index}
											type='button'
											onClick={button.action}
											className='flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white transition-colors hover:bg-white/10 active:scale-95'
											title={button.label}
										>
											{button.icon}
										</button>
									))}
								</div>

								{/* Editor header */}
								<div className='flex items-center justify-between border-b border-white/10 px-4 py-2 text-xs text-gray-400'>
									<span>Редактор</span>
									<span className='text-[10px] text-gray-500'>
										Markdown
									</span>
								</div>

								<textarea
									{...register('content', {
										required: 'Содержание обязательно',
									})}
									ref={(e) => {
										register('content').ref(e)
										// @ts-ignore
										textareaRef.current = e
									}}
									rows={24}
									className='min-h-[500px] w-full resize-none rounded-b-2xl bg-transparent px-4 py-3 font-mono text-sm text-white outline-none scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20'
									placeholder={'# Заголовок\n\nОсновной текст с **важными** моментами.\n\n## Подзаголовок\n\n- Пункт 1\n- Пункт 2\n\n```js\nconst code = "example";\n```'}
								/>
							</div>

							{/* Preview */}
							<div className='flex flex-col rounded-2xl border border-white/10 bg-white/5 overflow-hidden'>
								<div className='flex items-center justify-between border-b border-white/10 px-4 py-2 text-xs text-gray-400'>
									<span>Превью</span>
									<span className='text-[10px] text-gray-500'>
										Рендер
									</span>
								</div>
								<div className='min-h-[500px] overflow-y-auto px-4 py-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20'>
									{content?.trim() ? (
										<div className='markdown-preview text-sm'>
											<ReactMarkdown
												components={{
													h1: ({ children }) => (
														<h1 className='mb-4 mt-6 text-3xl font-bold text-white'>
															{children}
														</h1>
													),
													h2: ({ children }) => (
														<h2 className='mb-3 mt-6 text-2xl font-bold text-white'>
															{children}
														</h2>
													),
													h3: ({ children }) => (
														<h3 className='mb-2 mt-4 text-xl font-semibold text-white'>
															{children}
														</h3>
													),
													h4: ({ children }) => (
														<h4 className='mb-2 mt-3 text-lg font-semibold text-white'>
															{children}
														</h4>
													),
													p: ({ children }) => (
														<p className='mb-4 leading-relaxed text-gray-300'>
															{children}
														</p>
													),
													ul: ({ children }) => (
														<ul className='mb-4 ml-5 list-disc space-y-2 text-gray-300'>
															{children}
														</ul>
													),
													ol: ({ children }) => (
														<ol className='mb-4 ml-5 list-decimal space-y-2 text-gray-300'>
															{children}
														</ol>
													),
													li: ({ children }) => (
														<li className='leading-relaxed'>{children}</li>
													),
													code: ({ inline, children, ...props }: any) =>
														inline ? (
															<code className='rounded bg-purple-500/20 px-1.5 py-0.5 font-mono text-sm text-purple-300'>
																{children}
															</code>
														) : (
															<code
																className='block font-mono text-sm text-gray-300'
																{...props}
															>
																{children}
															</code>
														),
													pre: ({ children }) => (
														<pre className='mb-4 overflow-x-auto rounded-lg border border-white/10 bg-black/40 p-3'>
															{children}
														</pre>
													),
													blockquote: ({ children }) => (
														<blockquote className='mb-4 border-l-4 border-purple-500 bg-purple-500/10 pl-4 py-2 italic text-gray-300'>
															{children}
														</blockquote>
													),
													a: ({ href, children }) => (
														<a
															href={href}
															className='text-blue-400 underline decoration-blue-400/30 transition-colors hover:text-blue-300 hover:decoration-blue-300/50'
															target='_blank'
															rel='noopener noreferrer'
														>
															{children}
														</a>
													),
													strong: ({ children }) => (
														<strong className='font-bold text-white'>{children}</strong>
													),
													em: ({ children }) => (
														<em className='italic text-gray-200'>{children}</em>
													),
													hr: () => (
														<hr className='my-6 border-t border-white/10' />
													),
													del: ({ children }) => (
														<del className='text-gray-400 line-through'>{children}</del>
													),
													table: ({ children }) => (
														<div className='mb-4 overflow-x-auto'>
															<table className='min-w-full border-collapse border border-white/10'>
																{children}
															</table>
														</div>
													),
													thead: ({ children }) => (
														<thead className='bg-white/5'>{children}</thead>
													),
													tbody: ({ children }) => (
														<tbody>{children}</tbody>
													),
													tr: ({ children }) => (
														<tr className='border-b border-white/10'>{children}</tr>
													),
													th: ({ children }) => (
														<th className='border border-white/10 px-4 py-2 text-left font-semibold text-white'>
															{children}
														</th>
													),
													td: ({ children }) => (
														<td className='border border-white/10 px-4 py-2 text-gray-300'>
															{children}
														</td>
													),
												}}
											>
												{content}
											</ReactMarkdown>
										</div>
									) : (
										<p className='text-xs text-gray-500'>
											Начните вводить текст слева или используйте кнопки форматирования
										</p>
									)}
								</div>
							</div>
						</div>

						{errors.content && (
							<p className='mt-1 text-sm text-red-400'>
								{errors.content.message as string}
							</p>
						)}
					</div>

					{/* Actions */}
					<div className='flex gap-4 pt-6'>
						<button
							type='button'
							onClick={onClose}
							className='flex-1 rounded-xl border border-white/10 bg-white/5 px-6 py-4 font-semibold text-gray-300 transition-colors hover:bg-white/10'
						>
							Отмена
						</button>
						<button
							type='submit'
							className='flex-1 rounded-xl bg-white px-6 py-4 font-semibold text-black transition-colors hover:bg-white/90'
						>
							{isEditing ? (
								<>
									<Save className='mr-2 inline h-5 w-5' />
									Сохранить изменения
								</>
							) : (
								<>
									<Plus className='mr-2 inline h-5 w-5' />
									Добавить блок
								</>
							)}
						</button>
					</div>
				</form>
			</div>
		</m.div>
	)
}
