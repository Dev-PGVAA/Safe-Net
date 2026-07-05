import {
	BookOpen,
	Eye,
	FishingHook,
	Flag,
	Gamepad2,
	Globe,
	Lock,
	MessageCircle,
	Shield,
	ShoppingCart,
	TrendingUp,
	Trophy,
	Users
} from 'lucide-react'

export const features = [
	{
		icon: Gamepad2,
		title: 'Game Format',
		description:
			'8 difficulty levels and 300+ interactive tasks. Every level is a new challenge with unique scenarios',
		stats: '8 levels • 300+ tasks',
		color: 'from-purple-500 to-pink-500',
		highlight: 'Gamification'
	},
	{
		icon: Eye,
		title: 'Real Cases',
		description:
			'All tasks are based on real phishing attacks, data breaches, and fraud cases from 2024-2025',
		stats: '100% real threats',
		color: 'from-orange-500 to-red-500',
		highlight: 'Up to date'
	},
	{
		icon: TrendingUp,
		title: 'Progress Tracking',
		description:
			'Detailed analytics of your achievements: answer accuracy, completion time, weak spots and recommendations',
		stats: '15+ progress metrics',
		color: 'from-cyan-500 to-blue-500',
		highlight: 'Analytics'
	},
	{
		icon: BookOpen,
		title: 'Knowledge Base',
		description:
			'An extensive library of articles, video reviews, and security checklists. Always at hand',
		stats: '50+ articles and guides',
		color: 'from-indigo-500 to-purple-500',
		highlight: 'Education'
	},
	{
		icon: Trophy,
		title: 'Achievement System',
		description:
			'Unlock badges, earn titles and unique rewards. From beginner to cybersecurity expert',
		stats: '30+ unique rewards',
		color: 'from-yellow-500 to-orange-500',
		highlight: 'Motivation'
	},
	{
		icon: Lock,
		title: '100% Safe',
		description:
			'All data is encrypted. We never sell your information or show ads',
		stats: 'No ads',
		color: 'from-slate-500 to-slate-600',
		highlight: 'Privacy'
	}
]
export const topics = [
	{
		name: 'Security Basics',
		icon: Shield,
		tasks: 24,
		strokeColor: '#10B981'
	},
	{
		name: 'Phishing',
		icon: FishingHook,
		tasks: 48,
		strokeColor: '#F59E0B'
	},
	{
		name: 'Dangerous Links & Websites',
		icon: Globe,
		tasks: 40,
		strokeColor: '#3B82F6'
	},
	{
		name: 'Passwords',
		icon: Lock,
		tasks: 36,
		strokeColor: '#8B5CF6'
	},
	{
		name: 'Social Media',
		icon: MessageCircle,
		tasks: 40,
		strokeColor: '#EC4899'
	},
	{
		name: 'Online Shopping',
		icon: ShoppingCart,
		tasks: 32,
		strokeColor: '#F97316'
	},
	{
		name: 'Social Engineering',
		icon: Users,
		tasks: 44,
		strokeColor: '#06B6D4'
	},
	{
		name: 'Final Mission',
		icon: Flag,
		tasks: 28,
		strokeColor: '#EF4444'
	}
]
export const testimonials = [
	{
		text: 'SafeNet helped me spot a phishing email at work. I feel a lot more confident now!',
		author: 'Anna, 10th grade',
		rating: 5
	},
	{
		text: 'Such a cool format! Learning cybersecurity became as fun as playing a game.',
		author: 'Maxim, 11th grade',
		rating: 5
	},
	{
		text: 'Thanks to SafeNet, I taught my parents not to click on suspicious links.',
		author: 'Daria, 9th grade',
		rating: 5
	}
]
