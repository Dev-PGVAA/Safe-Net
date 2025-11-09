import { BookOpen, Eye, Gamepad2, Lock, TrendingUp, Trophy } from 'lucide-react'

export const features = [
	{
		icon: Gamepad2,
		title: 'Игровой формат',
		description:
			'8 этапов сложности и 300+ интерактивных заданий. Каждый уровень — это новый вызов с уникальными сценариями',
		stats: '8 этапов • 300+ заданий',
		color: 'from-purple-500 to-pink-500',
		highlight: 'Геймификация',
	},
	{
		icon: Eye,
		title: 'Реальные кейсы',
		description:
			'Все задания созданы на основе реальных фишинговых атак, утечек данных и случаев мошенничества 2024-2025 года',
		stats: '100% реальные угрозы',
		color: 'from-orange-500 to-red-500',
		highlight: 'Актуально',
	},
	{
		icon: TrendingUp,
		title: 'Трекинг прогресса',
		description:
			'Детальная аналитика твоих достижений: точность ответов, время прохождения, слабые места и рекомендации',
		stats: '15+ метрик прогресса',
		color: 'from-cyan-500 to-blue-500',
		highlight: 'Аналитика',
	},
	{
		icon: BookOpen,
		title: 'База знаний',
		description:
			'Подробная библиотека статей, видео-разборов и чек-листов безопасности. Всегда под рукой',
		stats: '50+ статей и гайдов',
		color: 'from-indigo-500 to-purple-500',
		highlight: 'Обучение',
	},
	{
		icon: Trophy,
		title: 'Система достижений',
		description:
			'Открывай значки, получай титулы и уникальные награды. От новичка до киберзащитника-эксперта',
		stats: '30+ уникальных наград',
		color: 'from-yellow-500 to-orange-500',
		highlight: 'Мотивация',
	},
	{
		icon: Lock,
		title: '100% безопасно',
		description:
			'Все данные защищены шифрованием. Мы не продаём информацию и не показываем рекламу',
		stats: 'Без рекламы',
		color: 'from-slate-500 to-slate-600',
		highlight: 'Приватность',
	},
]

export const topics = [
	{ name: 'Основы безопасности', icon: '🛡️', tasks: 24 },
	{ name: 'Фишинг', icon: '🎣', tasks: 48 },
	{ name: 'Опасные ссылки и сайты', icon: '🌐', tasks: 40 },
	{ name: 'Пароли', icon: '🔐', tasks: 36 },
	{ name: 'Соцсети', icon: '💬', tasks: 40 },
	{ name: 'Покупки', icon: '🛍️', tasks: 32 },
	{ name: 'Социальная инженерия', icon: '🧠', tasks: 44 },
	{ name: 'Итоговая миссия', icon: '🏁', tasks: 28 },
]

export const testimonials = [
	{
		text: 'SafeNet помог мне распознать фишинговое письмо на работе. Теперь чувствую себя увереннее!',
		author: 'Анна, 10 класс',
		rating: 5,
	},
	{
		text: 'Очень крутой формат! Учиться кибербезопасности стало интересно, как играть в игру.',
		author: 'Максим, 11 класс',
		rating: 5,
	},
	{
		text: 'Благодаря SafeNet научил родителей не переходить по подозрительным ссылкам.',
		author: 'Дарья, 9 класс',
		rating: 5,
	},
]
