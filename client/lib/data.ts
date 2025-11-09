import { Gamepad2, Eye, TrendingUp, Users, BookOpen, Trophy, Zap, Brain, Lock } from 'lucide-react';

export const features = [
  {
    icon: Gamepad2,
    title: "Игровой формат",
    description: "8 уровней сложности и 120+ интерактивных заданий. Каждый уровень — это новый вызов с уникальными сценариями",
    stats: "8 уровней • 120+ заданий",
    color: "from-purple-500 to-pink-500",
    highlight: "Геймификация"
  },
  {
    icon: Eye,
    title: "Реальные кейсы",
    description: "Все задания созданы на основе реальных фишинговых атак, утечек данных и случаев мошенничества 2024-2025 года",
    stats: "100% реальные угрозы",
    color: "from-orange-500 to-red-500",
    highlight: "Актуально"
  },
  {
    icon: TrendingUp,
    title: "Трекинг прогресса",
    description: "Детальная аналитика твоих достижений: точность ответов, время прохождения, слабые места и рекомендации",
    stats: "15+ метрик прогресса",
    color: "from-cyan-500 to-blue-500",
    highlight: "Аналитика"
  },
  {
    icon: Users,
    title: "Соревнования",
    description: "Создавай команды с друзьями, соревнуйтесь в рейтинге класса или школы. Еженедельные турниры с призами",
    stats: "Турниры каждую неделю",
    color: "from-emerald-500 to-teal-500",
    highlight: "Социально"
  },
  {
    icon: BookOpen,
    title: "База знаний",
    description: "Подробная библиотека статей, видео-разборов и чек-листов безопасности. Всегда под рукой",
    stats: "50+ статей и гайдов",
    color: "from-indigo-500 to-purple-500",
    highlight: "Обучение"
  },
  {
    icon: Trophy,
    title: "Система достижений",
    description: "Открывай значки, получай титулы и уникальные награды. От новичка до киберзащитника-эксперта",
    stats: "30+ уникальных наград",
    color: "from-yellow-500 to-orange-500",
    highlight: "Мотивация"
  },
  {
    icon: Zap,
    title: "Быстрый старт",
    description: "Не нужна регистрация для пробного урока. Начни учиться прямо сейчас за 30 секунд",
    stats: "Старт за 30 секунд",
    color: "from-rose-500 to-pink-500",
    highlight: "Просто"
  },
  {
    icon: Brain,
    title: "AI-помощник",
    description: "Персональный AI-ассистент анализирует твои ошибки и даёт умные советы для улучшения навыков",
    stats: "Персональные советы",
    color: "from-violet-500 to-purple-500",
    highlight: "Технологично"
  },
  {
    icon: Lock,
    title: "100% безопасно",
    description: "Все данные защищены шифрованием. Мы не продаём информацию и не показываем рекламу",
    stats: "Без рекламы",
    color: "from-slate-500 to-slate-600",
    highlight: "Приватность"
  }
];

export const topics = [
  { name: "Фишинг", icon: "🎣", progress: 45, tasks: 24 },
  { name: "Пароли", icon: "🔐", progress: 30, tasks: 18 },
  { name: "Соцсети", icon: "💬", progress: 60, tasks: 20 },
  { name: "Покупки", icon: "🛍️", progress: 15, tasks: 16 }
];

export const testimonials = [
  {
    text: "SafeNet помог мне распознать фишинговое письмо на работе. Теперь чувствую себя увереннее!",
    author: "Анна, 10 класс",
    rating: 5
  },
  {
    text: "Очень крутой формат! Учиться кибербезопасности стало интересно, как играть в игру.",
    author: "Максим, 11 класс",
    rating: 5
  },
  {
    text: "Благодаря SafeNet научил родителей не переходить по подозрительным ссылкам.",
    author: "Дарья, 9 класс",
    rating: 5
  }
];