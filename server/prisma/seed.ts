import { PrismaPg } from '@prisma/adapter-pg'
import {
	BlockType,
	Difficulty,
	PrismaClient,
	Role,
	TaskType,
} from '@prisma/client'
import { hash } from 'argon2'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
	console.log('🚀 Starting FULL seed with 8 stages...')
	const hashedPassword = await hash('password123')

	await prisma.$transaction(async tx => {
		console.log('🧹 Cleaning database...')
		await tx.taskAttempt.deleteMany()
		await tx.testResult.deleteMany()
		await tx.completedLesson.deleteMany()
		await tx.courseProgress.deleteMany()
		await tx.userAchievement.deleteMany()
		await tx.certificate.deleteMany()
		await tx.taskOption.deleteMany()
		await tx.testQuestionOption.deleteMany()
		await tx.testQuestion.deleteMany()
		await tx.task.deleteMany()
		await tx.lessonBlock.deleteMany()
		await tx.lesson.deleteMany()
		await tx.test.deleteMany()
		await tx.course.deleteMany()
		await tx.stage.deleteMany()
		await tx.user.deleteMany()
		await tx.achievement.deleteMany()

		function calculateEstimatedDuration(
			blocksCount: number,
			tasksCount: number
		): number {
			const BASE_TIME = 2
			const TIME_PER_BLOCK = 2
			const TIME_PER_TASK = 5
			return (
				BASE_TIME + blocksCount * TIME_PER_BLOCK + tasksCount * TIME_PER_TASK
			)
		}

		console.log('👥 Creating users...')
		const demoUser = await tx.user.upsert({
			where: { email: 'demo@safe.net' },
			update: {},
			create: {
				email: 'demo@safe.net',
				name: 'Демо Пользователь',
				password: hashedPassword,
				rights: [Role.USER],
			},
		})

		const adminUser = await tx.user.upsert({
			where: { email: 'admin@safe.net' },
			update: {},
			create: {
				email: 'admin@safe.net',
				name: 'Админ',
				password: hashedPassword,
				rights: [Role.ADMIN, Role.USER],
			},
		})

		console.log('📚 Creating 8 stages...')
		const stages = await Promise.all([
			tx.stage.create({
				data: {
					order: 1,
					slug: 'basics',
					title: 'Основы безопасности',
					subtitle: 'Фундаментальные знания • 3 курса',
					icon: 'shield',
				},
			}),
			tx.stage.create({
				data: {
					order: 2,
					slug: 'phishing',
					title: 'Фишинг и мошенничество',
					subtitle: 'Распознавание угроз • 3 курса',
					icon: 'fish',
				},
			}),
			tx.stage.create({
				data: {
					order: 3,
					slug: 'dangerous-links',
					title: 'Опасные ссылки',
					subtitle: 'Проверка URL • 2 курса',
					icon: 'link-2-off',
				},
			}),
			tx.stage.create({
				data: {
					order: 4,
					slug: 'passwords',
					title: 'Пароли',
					subtitle: 'Надежная аутентификация • 3 курса',
					icon: 'lock',
				},
			}),
			tx.stage.create({
				data: {
					order: 5,
					slug: 'malware',
					title: 'Вредоносное ПО',
					subtitle: 'Защита от угроз • 2 курса',
					icon: 'bug',
				},
			}),
			tx.stage.create({
				data: {
					order: 6,
					slug: 'social-media',
					title: 'Соцсети',
					subtitle: 'Безопасность онлайн • 2 курса',
					icon: 'users',
				},
			}),
			tx.stage.create({
				data: {
					order: 7,
					slug: 'privacy',
					title: 'Личные данные',
					subtitle: 'Конфиденциальность • 3 курса',
					icon: 'eye-off',
				},
			}),
			tx.stage.create({
				data: {
					order: 8,
					slug: 'advanced',
					title: 'Продвинутый уровень',
					subtitle: 'Для экспертов • 2 курса',
					icon: 'zap',
				},
			}),
		])

		console.log('🎓 Creating courses for all stages...')

		// ========================
		// ЭТАП 1: ОСНОВЫ БЕЗОПАСНОСТИ
		// ========================
		const course1 = await tx.course.create({
			data: {
				slug: 'digital-safety-basics',
				title: 'Основы цифровой безопасности',
				description: 'Фундаментальные принципы защиты в интернете',
				difficulty: Difficulty.EASY,
				stageId: stages[0].id,
			},
		})

		const lesson1_1 = await tx.lesson.create({
			data: {
				title: 'Что такое цифровая безопасность?',
				order: 1,
				courseId: course1.id,
				estimatedDuration: calculateEstimatedDuration(3, 2),
			},
		})

		await tx.lessonBlock.createMany({
			data: [
				{
					lessonId: lesson1_1.id,
					order: 1,
					type: BlockType.THEORY,
					title: 'Введение в цифровую безопасность',
					content: `Цифровая безопасность — это защита ваших данных, устройств и личной информации в интернете. В современном мире мы храним на телефонах и компьютерах фотографии, переписки, банковские данные и многое другое.

Без правильной защиты злоумышленники могут:
- Украсть ваши деньги
- Получить доступ к личной переписке
- Использовать ваши данные для мошенничества
- Заблокировать доступ к вашим файлам`,
				},
				{
					lessonId: lesson1_1.id,
					order: 2,
					type: BlockType.THEORY,
					title: 'Основные угрозы',
					content: `**Вирусы и вредоносное ПО** — программы, которые заражают ваше устройство и крадут данные.

**Фишинг** — мошенники выдают себя за банки или известные компании, чтобы выманить ваши пароли.

**Слежка** — сбор информации о вас без вашего согласия.

**Утечки данных** — когда компании теряют базы с паролями пользователей.`,
				},
				{
					lessonId: lesson1_1.id,
					order: 3,
					type: BlockType.THEORY,
					title: 'Как защититься?',
					content: `1. Используйте надежные пароли
2. Включите двухфакторную аутентификацию
3. Устанавливайте обновления системы
4. Не открывайте подозрительные ссылки
5. Используйте антивирус
6. Делайте резервные копии важных файлов`,
				},
			],
		})

		const task1_1 = await tx.task.create({
			data: {
				lessonId: lesson1_1.id,
				order: 1,
				type: TaskType.SINGLE_CHOICE,
				title: 'Основные угрозы',
				question: 'Что НЕ является угрозой цифровой безопасности?',
				points: 10,
				difficulty: Difficulty.EASY,
				correctAnswerIndex: 2,
				explanation:
					'Обновления операционной системы не являются угрозой — наоборот, они закрывают уязвимости и защищают от атак.', // ✅ Добавьте
			},
		})

		await tx.taskOption.createMany({
			data: [
				{
					taskId: task1_1.id,
					order: 1,
					text: 'Фишинговое письмо от "банка"',
					isCorrect: false,
				},
				{
					taskId: task1_1.id,
					order: 2,
					text: 'Вирус на флешке',
					isCorrect: false,
				},
				{
					taskId: task1_1.id,
					order: 3,
					text: 'Обновление операционной системы',
					isCorrect: true,
				},
				{
					taskId: task1_1.id,
					order: 4,
					text: 'Взлом аккаунта',
					isCorrect: false,
				},
			],
		})

		const task1_2 = await tx.task.create({
			data: {
				lessonId: lesson1_1.id,
				order: 2,
				type: TaskType.MULTI_CHOICE,
				title: 'Методы защиты',
				question: 'Выберите правильные способы защиты (несколько вариантов):',
				points: 15,
				difficulty: Difficulty.EASY,
				explanation:
					'Двухфакторная аутентификация и обновления безопасности — основные методы защиты. Один пароль везде и отключение антивируса делают вас уязвимыми.', // ✅
			},
		})

		await tx.taskOption.createMany({
			data: [
				{
					taskId: task1_2.id,
					order: 1,
					text: 'Использовать один пароль везде',
					isCorrect: false,
				},
				{
					taskId: task1_2.id,
					order: 2,
					text: 'Включить двухфакторную аутентификацию',
					isCorrect: true,
				},
				{
					taskId: task1_2.id,
					order: 3,
					text: 'Устанавливать обновления безопасности',
					isCorrect: true,
				},
				{
					taskId: task1_2.id,
					order: 4,
					text: 'Отключить антивирус для ускорения ПК',
					isCorrect: false,
				},
			],
		})

		const lesson1_2 = await tx.lesson.create({
			data: {
				title: 'Антивирус и обновления',
				order: 2,
				courseId: course1.id,
				estimatedDuration: calculateEstimatedDuration(2, 1),
			},
		})

		await tx.lessonBlock.createMany({
			data: [
				{
					lessonId: lesson1_2.id,
					order: 1,
					type: BlockType.THEORY,
					title: 'Зачем нужен антивирус?',
					content: `Антивирус — это программа, которая защищает ваш компьютер от вредоносного ПО. Он работает как охранник, проверяя все файлы и программы на наличие угроз.

**Что делает антивирус:**
- Сканирует файлы при скачивании
- Блокирует опасные сайты
- Удаляет обнаруженные вирусы
- Защищает в реальном времени

**Популярные антивирусы:** Windows Defender (встроен в Windows), Kaspersky, ESET, Avast.`,
				},
				{
					lessonId: lesson1_2.id,
					order: 2,
					type: BlockType.THEORY,
					title: 'Обновления системы',
					content: `Обновления закрывают уязвимости в операционной системе. Хакеры постоянно ищут слабые места, а разработчики выпускают "заплатки".

**Почему это важно:**
- В 2017 вирус WannaCry заразил 200 000 компьютеров, используя уязвимость, для которой уже был патч
- Устаревшие системы — легкая цель для атак
- Обновления также улучшают производительность

**Как включить автообновления:**
Windows: Настройки → Обновление и безопасность → Автоматически
macOS: Системные настройки → Обновление ПО → Автоматически`,
				},
			],
		})

		const task1_3 = await tx.task.create({
			data: {
				lessonId: lesson1_2.id,
				order: 1,
				type: TaskType.SINGLE_CHOICE,
				title: 'Роль антивируса',
				question: 'Какая основная функция антивируса?',
				points: 10,
				difficulty: Difficulty.EASY,
				correctAnswerIndex: 1,
			},
		})

		await tx.taskOption.createMany({
			data: [
				{
					taskId: task1_3.id,
					order: 1,
					text: 'Ускорять работу компьютера',
					isCorrect: false,
				},
				{
					taskId: task1_3.id,
					order: 2,
					text: 'Обнаруживать и блокировать вирусы',
					isCorrect: true,
				},
				{
					taskId: task1_3.id,
					order: 3,
					text: 'Увеличивать скорость интернета',
					isCorrect: false,
				},
				{
					taskId: task1_3.id,
					order: 4,
					text: 'Удалять ненужные файлы',
					isCorrect: false,
				},
			],
		})

		const course2 = await tx.course.create({
			data: {
				slug: 'safe-browsing',
				title: 'Безопасный интернет-серфинг',
				description: 'Как безопасно пользоваться браузером',
				difficulty: Difficulty.EASY,
				stageId: stages[0].id,
			},
		})

		const lesson2_1 = await tx.lesson.create({
			data: {
				title: 'HTTPS и безопасные соединения',
				order: 1,
				courseId: course2.id,
				estimatedDuration: calculateEstimatedDuration(2, 1),
			},
		})

		await tx.lessonBlock.createMany({
			data: [
				{
					lessonId: lesson2_1.id,
					order: 1,
					type: BlockType.THEORY,
					title: 'Что такое HTTPS?',
					content: `HTTPS — это защищенная версия протокола HTTP. Буква "S" означает Secure (безопасный).

**В чем разница:**
- HTTP — данные передаются открытым текстом
- HTTPS — данные шифруются

**Как проверить:**
Посмотрите на адресную строку браузера. Должен быть замочек 🔒 и "https://" в начале URL.

**Когда это критично:**
- Интернет-банкинг
- Онлайн-покупки
- Ввод паролей
- Личная переписка`,
				},
				{
					lessonId: lesson2_1.id,
					order: 2,
					type: BlockType.THEORY,
					title: 'Опасность публичного Wi-Fi',
					content: `В кафе, аэропортах и других местах с бесплатным Wi-Fi ваши данные могут перехватить.

**Что может украсть хакер в публичной сети:**
- Пароли от соцсетей
- Данные банковских карт
- Переписку
- Куки и сессии

**Как защититься:**
1. Используйте VPN (виртуальную частную сеть)
2. Не вводите пароли в публичном Wi-Fi
3. Отключайте автоподключение к сетям
4. Используйте мобильный интернет для важных операций`,
				},
			],
		})

		const task2_1 = await tx.task.create({
			data: {
				lessonId: lesson2_1.id,
				order: 1,
				type: TaskType.SINGLE_CHOICE,
				title: 'Безопасное соединение',
				question: 'По какому признаку определить безопасное соединение?',
				points: 10,
				difficulty: Difficulty.EASY,
				correctAnswerIndex: 1,
				explanation:
					'Замочек 🔒 и префикс https:// указывают на шифрование данных по протоколу SSL/TLS.', // ✅
			},
		})

		await tx.taskOption.createMany({
			data: [
				{
					taskId: task2_1.id,
					order: 1,
					text: 'Сайт быстро загружается',
					isCorrect: false,
				},
				{
					taskId: task2_1.id,
					order: 2,
					text: 'В адресной строке есть замочек и https://',
					isCorrect: true,
				},
				{
					taskId: task2_1.id,
					order: 3,
					text: 'Сайт имеет красивый дизайн',
					isCorrect: false,
				},
				{
					taskId: task2_1.id,
					order: 4,
					text: 'Сайт на английском языке',
					isCorrect: false,
				},
			],
		})

		const course3 = await tx.course.create({
			data: {
				slug: 'device-security',
				title: 'Защита устройств',
				description: 'Безопасность смартфонов и компьютеров',
				difficulty: Difficulty.MEDIUM,
				stageId: stages[0].id,
			},
		})

		const lesson3_1 = await tx.lesson.create({
			data: {
				title: 'Блокировка экрана и биометрия',
				order: 1,
				courseId: course3.id,
				estimatedDuration: calculateEstimatedDuration(2, 1),
			},
		})

		await tx.lessonBlock.createMany({
			data: [
				{
					lessonId: lesson3_1.id,
					order: 1,
					type: BlockType.THEORY,
					title: 'Почему важна блокировка экрана',
					content: `Блокировка экрана — первая линия защиты вашего устройства. Если телефон попадет в чужие руки, блокировка не даст получить доступ к данным.

**Типы блокировки:**
- PIN-код (4-6 цифр)
- Графический ключ
- Отпечаток пальца
- Face ID / распознавание лица
- Пароль

**Что защищает блокировка:**
- Фотографии и видео
- Переписки в мессенджерах
- Банковские приложения
- Email и соцсети
- Файлы и документы`,
				},
				{
					lessonId: lesson3_1.id,
					order: 2,
					type: BlockType.THEORY,
					title: 'Биометрия: за и против',
					content: `**Преимущества биометрии:**
- Быстрый доступ к устройству
- Сложно подделать
- Не нужно запоминать пароль
- Удобно в использовании

**Недостатки:**
- Можно разблокировать во сне
- Нельзя изменить отпечаток пальца
- При утечке биометрические данные скомпрометированы навсегда

**Рекомендации:**
Используйте биометрию + PIN-код вместе. Если один метод скомпрометирован, второй защитит данные.`,
				},
			],
		})

		const task3_1 = await tx.task.create({
			data: {
				lessonId: lesson3_1.id,
				order: 1,
				type: TaskType.SINGLE_CHOICE,
				title: 'Методы блокировки',
				question: 'Какой метод блокировки самый надежный?',
				points: 10,
				difficulty: Difficulty.MEDIUM,
				correctAnswerIndex: 3,
				explanation:
					'Комбинация биометрии и сложного PIN создает два независимых уровня защиты.', // ✅
			},
		})

		await tx.taskOption.createMany({
			data: [
				{
					taskId: task3_1.id,
					order: 1,
					text: 'Графический ключ',
					isCorrect: false,
				},
				{
					taskId: task3_1.id,
					order: 2,
					text: 'Простой PIN 1234',
					isCorrect: false,
				},
				{
					taskId: task3_1.id,
					order: 3,
					text: 'Отпечаток пальца',
					isCorrect: false,
				},
				{
					taskId: task3_1.id,
					order: 4,
					text: 'Биометрия + сложный PIN-код',
					isCorrect: true,
				},
			],
		})

		// ========================
		// ЭТАП 2: ФИШИНГ
		// ========================
		const course4 = await tx.course.create({
			data: {
				slug: 'phishing-basics',
				title: 'Введение в фишинг',
				description: 'Учимся распознавать фишинговые атаки',
				difficulty: Difficulty.MEDIUM,
				stageId: stages[1].id,
			},
		})

		const lesson4_1 = await tx.lesson.create({
			data: {
				title: 'Что такое фишинг?',
				order: 1,
				courseId: course4.id,
				estimatedDuration: calculateEstimatedDuration(3, 2),
			},
		})

		await tx.lessonBlock.createMany({
			data: [
				{
					lessonId: lesson4_1.id,
					order: 1,
					type: BlockType.THEORY,
					title: 'Определение фишинга',
					content: `Фишинг (phishing) — это вид мошенничества, когда злоумышленники выдают себя за доверенные организации, чтобы выманить у вас:
- Пароли
- Данные банковских карт
- Личную информацию
- Деньги

**Откуда название:**
Слово "phishing" произошло от "fishing" (рыбалка). Мошенники "забрасывают удочку" в виде поддельного письма и ждут, кто "клюнет".

**Статистика:**
- 90% кибератак начинаются с фишинга
- Средний ущерб от одной атаки — $1.6 млн
- Каждый день отправляется 3.4 млрд фишинговых писем`,
				},
				{
					lessonId: lesson4_1.id,
					order: 2,
					type: BlockType.THEORY,
					title: 'Типы фишинга',
					content: `**Email-фишинг** — поддельные письма от "банков" и "служб поддержки"

**Smishing (SMS-фишинг)** — мошеннические SMS: "Ваша посылка ожидает получения, перейдите по ссылке"

**Vishing (голосовой фишинг)** — звонки якобы от банка с требованием назвать код из SMS

**Spear phishing** — целенаправленная атака на конкретного человека (часто руководителей)

**Whaling** — атака на топ-менеджеров компаний`,
				},
				{
					lessonId: lesson4_1.id,
					order: 3,
					type: BlockType.THEORY,
					title: 'Признаки фишинга',
					content: `🚩 **Срочность** — "Ваш аккаунт заблокируют через 24 часа!"

🚩 **Угрозы** — "Если не подтвердите данные, счет будет закрыт"

🚩 **Слишком хорошее предложение** — "Вы выиграли iPhone!"

🚩 **Ошибки в тексте** — орфографические и грамматические

🚩 **Странный адрес отправителя** — support@amaz0n.com вместо amazon.com

🚩 **Подозрительные ссылки** — gooogle.com, paypa1.com

🚩 **Просьба ввести пароль** — настоящие компании никогда не просят пароль`,
				},
			],
		})

		const task4_1 = await tx.task.create({
			data: {
				lessonId: lesson4_1.id,
				order: 1,
				type: TaskType.SINGLE_CHOICE,
				title: 'Определение фишинга',
				question: 'Письмо с каким содержанием точно фишинговое?',
				points: 10,
				difficulty: Difficulty.MEDIUM,
				correctAnswerIndex: 1,
				explanation:
					'Легитимные сервисы НИКОГДА не просят срочно подтвердить пароль по ссылке. Это классический признак фишинга.', // ✅
			},
		})

		await tx.taskOption.createMany({
			data: [
				{
					taskId: task4_1.id,
					order: 1,
					text: 'Уведомление о доставке посылки от курьерской службы',
					isCorrect: false,
				},
				{
					taskId: task4_1.id,
					order: 2,
					text: 'Требование срочно подтвердить пароль, иначе аккаунт удалят',
					isCorrect: true,
				},
				{
					taskId: task4_1.id,
					order: 3,
					text: 'Новостная рассылка от магазина',
					isCorrect: false,
				},
				{
					taskId: task4_1.id,
					order: 4,
					text: 'Подтверждение заказа с известного сайта',
					isCorrect: false,
				},
			],
		})

		const task4_2 = await tx.task.create({
			data: {
				lessonId: lesson4_1.id,
				order: 2,
				type: TaskType.MULTI_CHOICE,
				title: 'Признаки фишинга',
				question: 'Выберите ВСЕ признаки фишингового письма:',
				points: 15,
				difficulty: Difficulty.MEDIUM,
				explanation:
					'Срочность, ошибки и просьба ввести пароль — классические признаки фишинга. Персональное обращение может быть в легитимных письмах.', // ✅
			},
		})

		await tx.taskOption.createMany({
			data: [
				{
					taskId: task4_2.id,
					order: 1,
					text: 'Срочность и угрозы',
					isCorrect: true,
				},
				{
					taskId: task4_2.id,
					order: 2,
					text: 'Ошибки в тексте',
					isCorrect: true,
				},
				{
					taskId: task4_2.id,
					order: 3,
					text: 'Персональное обращение по имени',
					isCorrect: false,
				},
				{
					taskId: task4_2.id,
					order: 4,
					text: 'Просьба ввести пароль по ссылке',
					isCorrect: true,
				},
			],
		})

		const lesson4_2 = await tx.lesson.create({
			data: {
				title: 'Анализ фишинговых писем',
				order: 2,
				courseId: course4.id,
				estimatedDuration: calculateEstimatedDuration(3, 2),
			},
		})

		await tx.lessonBlock.createMany({
			data: [
				{
					lessonId: lesson4_2.id,
					order: 1,
					type: BlockType.THEORY,
					title: 'Как проверить письмо?',
					content: `**Шаг 1: Проверьте адрес отправителя**
Наведите мышку на имя отправителя. Настоящий Amazon пишет с @amazon.com, а не с @amazonsupport.tk

**Шаг 2: Анализ ссылок**
Наведите на ссылку (не нажимайте!). Внизу браузера появится реальный адрес. Если написано "Войти в PayPal", а ссылка ведет на странный домен — это фишинг.

**Шаг 3: Проверьте грамматику**
Банки и крупные компании тщательно проверяют тексты. Ошибки — признак мошенников.

**Шаг 4: Подумайте логически**
Если вы не заказывали посылку — зачем вам уведомление? Если не регистрировались на сайте — откуда письмо?`,
				},
				{
					lessonId: lesson4_2.id,
					order: 2,
					type: BlockType.THEORY,
					title: 'Примеры фишинга',
					content: `**Пример 1: Поддельный банк**
"Уважаемый клиент! Ваша карта заблокирована. Перейдите по ссылке и подтвердите данные"
❌ Банк обращается по имени
❌ Банк не просит подтверждать данные по ссылке

**Пример 2: Налоговая служба**
"Вам положен налоговый вычет 45 000₽. Введите данные карты для перевода"
❌ Налоговая не запрашивает данные карт
❌ Вычеты оформляются через личный кабинет

**Пример 3: Служба безопасности**
"Ваш аккаунт взломан! Срочно смените пароль по ссылке"
❌ Создание паники и срочности
❌ Смена пароля только на официальном сайте`,
				},
			],
		})

		const task4_3 = await tx.task.create({
			data: {
				lessonId: lesson4_2.id,
				order: 1,
				type: TaskType.SINGLE_CHOICE,
				title: 'Проверка ссылок',
				question: 'Как правильно проверить ссылку в письме?',
				points: 10,
				difficulty: Difficulty.MEDIUM,
				correctAnswerIndex: 1,
				explanation:
					'При наведении курсора на ссылку внизу браузера отображается реальный URL. Нажимать не нужно — это может быть опасно.', // ✅
			},
		})

		await tx.taskOption.createMany({
			data: [
				{
					taskId: task4_3.id,
					order: 1,
					text: 'Нажать на ссылку и посмотреть, куда ведет',
					isCorrect: false,
				},
				{
					taskId: task4_3.id,
					order: 2,
					text: 'Навести мышку на ссылку и посмотреть URL внизу',
					isCorrect: true,
				},
				{
					taskId: task4_3.id,
					order: 3,
					text: 'Скопировать ссылку в Google',
					isCorrect: false,
				},
				{
					taskId: task4_3.id,
					order: 4,
					text: 'Спросить у друзей',
					isCorrect: false,
				},
			],
		})

		const course5 = await tx.course.create({
			data: {
				slug: 'social-engineering',
				title: 'Социальная инженерия',
				description: 'Психологические методы манипуляции',
				difficulty: Difficulty.HARD,
				stageId: stages[1].id,
			},
		})

		const lesson5_1 = await tx.lesson.create({
			data: {
				title: 'Методы социальной инженерии',
				order: 1,
				courseId: course5.id,
				estimatedDuration: calculateEstimatedDuration(2, 1),
			},
		})

		await tx.lessonBlock.createMany({
			data: [
				{
					lessonId: lesson5_1.id,
					order: 1,
					type: BlockType.THEORY,
					title: 'Что такое социальная инженерия?',
					content: `Социальная инженерия — это манипуляция людьми для получения конфиденциальной информации или доступа к системам.

Хакеры используют психологию вместо технических методов:
- Доверие
- Страх
- Жадность
- Любопытство
- Авторитет

**Известные случаи:**
- Кевин Митник взламывал компании, звоня сотрудникам и выдавая себя за IT-поддержку
- В 2016 хакеры похитили $81 млн из Центробанка Бангладеш через социнженерию`,
				},
				{
					lessonId: lesson5_1.id,
					order: 2,
					type: BlockType.THEORY,
					title: 'Техники манипуляции',
					content: `**Pretexting (предлог)** — создание выдуманной ситуации
"Я из IT-отдела, нужно срочно проверить ваш пароль"

**Baiting (приманка)** — предложение чего-то заманчивого
Зараженная флешка с надписью "Зарплаты 2024"

**Quid pro quo** — услуга за услугу
"Я помогу решить проблему, но мне нужен ваш пароль"

**Tailgating** — физическое проникновение
Человек с коробкой просит придержать дверь в офис

**Authority (авторитет)** — выдавание себя за начальство
"Это директор, срочно переведите деньги!"`,
				},
			],
		})

		const task5_1 = await tx.task.create({
			data: {
				lessonId: lesson5_1.id,
				order: 1,
				type: TaskType.SINGLE_CHOICE,
				title: 'Социальная инженерия',
				question:
					'Звонок якобы от техподдержки с просьбой назвать код из СМС. Это:',
				points: 15,
				difficulty: Difficulty.HARD,
				correctAnswerIndex: 1,
				explanation:
					'Это vishing (голосовой фишинг) — разновидность социальной инженерии. Настоящая техподдержка никогда не спросит код из SMS.', // ✅
			},
		})

		await tx.taskOption.createMany({
			data: [
				{
					taskId: task5_1.id,
					order: 1,
					text: 'Стандартная процедура проверки',
					isCorrect: false,
				},
				{
					taskId: task5_1.id,
					order: 2,
					text: 'Социальная инженерия (vishing)',
					isCorrect: true,
				},
				{
					taskId: task5_1.id,
					order: 3,
					text: 'Законное требование банка',
					isCorrect: false,
				},
				{
					taskId: task5_1.id,
					order: 4,
					text: 'Техническая поддержка',
					isCorrect: false,
				},
			],
		})

		const course6 = await tx.course.create({
			data: {
				slug: 'phishing-practice',
				title: 'Практика: Распознавание фишинга',
				description: 'Реальные примеры и задания',
				difficulty: Difficulty.MEDIUM,
				stageId: stages[1].id,
			},
		})

		const lesson6_1 = await tx.lesson.create({
			data: {
				title: 'Разбор реальных кейсов',
				order: 1,
				courseId: course6.id,
				estimatedDuration: calculateEstimatedDuration(1, 1),
			},
		})

		await tx.lessonBlock.create({
			data: {
				lessonId: lesson6_1.id,
				order: 1,
				type: BlockType.THEORY,
				title: 'Кейс 1: Поддельный банк',
				content: `**Полученное письмо:**
Тема: "Срочно! Подтвердите операцию"
От: security@sberbank-online.ru

"Уважаемый клиент!
Зафиксирована подозрительная операция на сумму 15 000₽.
Если это не вы, перейдите по ссылке и отмените транзакцию: http://sber-bank.ru.secure-check.com/cancel

У вас 2 часа."

**Анализ:**
❌ Домен secure-check.com (не сбербанк)
❌ Создание паники и срочности
❌ Банк обращается "клиент", а не по имени
✅ Правильный домен: sberbank.ru или online.sberbank.ru`,
			},
		})

		const task6_1 = await tx.task.create({
			data: {
				lessonId: lesson6_1.id,
				order: 1,
				type: TaskType.SINGLE_CHOICE,
				title: 'Анализ фишинга',
				question: 'Какой домен точно НЕ фишинговый для Сбербанка?',
				points: 10,
				difficulty: Difficulty.MEDIUM,
				correctAnswerIndex: 1,
				explanation:
					'online.sberbank.ru — официальный поддомен Сбербанка. Остальные используют дефисы и другие домены верхнего уровня.', // ✅
			},
		})

		await tx.taskOption.createMany({
			data: [
				{
					taskId: task6_1.id,
					order: 1,
					text: 'sberbank-secure.com',
					isCorrect: false,
				},
				{
					taskId: task6_1.id,
					order: 2,
					text: 'online.sberbank.ru',
					isCorrect: true,
				},
				{
					taskId: task6_1.id,
					order: 3,
					text: 'sber-bank.ru',
					isCorrect: false,
				},
				{
					taskId: task6_1.id,
					order: 4,
					text: 'sberbank.online.com',
					isCorrect: false,
				},
			],
		})

		// ========================
		// ЭТАП 3: ОПАСНЫЕ ССЫЛКИ
		// ========================
		const course7 = await tx.course.create({
			data: {
				slug: 'url-analysis',
				title: 'Анализ URL-адресов',
				description: 'Учимся проверять безопасность ссылок',
				difficulty: Difficulty.MEDIUM,
				stageId: stages[2].id,
			},
		})

		const lesson7_1 = await tx.lesson.create({
			data: {
				title: 'Структура URL',
				order: 1,
				courseId: course7.id,
				estimatedDuration: calculateEstimatedDuration(2, 1),
			},
		})

		await tx.lessonBlock.createMany({
			data: [
				{
					lessonId: lesson7_1.id,
					order: 1,
					type: BlockType.THEORY,
					title: 'Анатомия URL',
					content: `URL (Uniform Resource Locator) — адрес ресурса в интернете.

**Структура:**
https://www.example.com:443/path/page?id=123#section

1. **Протокол:** https:// (защищенный) или http:// (незащищенный)
2. **Субдомен:** www
3. **Домен:** example.com (основная часть!)
4. **Порт:** :443 (обычно скрыт)
5. **Путь:** /path/page
6. **Параметры:** ?id=123
7. **Якорь:** #section

**Самое важное:** домен. Остальное может быть любым.`,
				},
				{
					lessonId: lesson7_1.id,
					order: 2,
					type: BlockType.THEORY,
					title: 'Трюки мошенников',
					content: `**Замена символов:**
- gооgle.com (вместо o — кириллица о)
- paypa1.com (l → 1)
- αpple.com (α — греческая буква)

**Поддомены-обманки:**
- apple.com.fake-site.com (домен fake-site.com!)
- secure-paypal.phishing.net

**Короткие ссылки:**
- bit.ly/abc123 — неизвестно куда ведет
- Могут скрывать вредоносные сайты

**IP-адреса:**
- http://192.168.1.1/login
- Легальные сайты используют домены, не IP`,
				},
			],
		})

		const task7_1 = await tx.task.create({
			data: {
				lessonId: lesson7_1.id,
				order: 1,
				type: TaskType.SINGLE_CHOICE,
				title: 'Определение домена',
				question:
					'Какой реальный домен в ссылке: https://amazon.fake-store.com/products',
				points: 10,
				difficulty: Difficulty.MEDIUM,
				correctAnswerIndex: 1,
				explanation:
					'Домен читается справа налево. fake-store.com — настоящий домен, а amazon — просто поддомен мошенников.', // ✅
			},
		})

		await tx.taskOption.createMany({
			data: [
				{ taskId: task7_1.id, order: 1, text: 'amazon', isCorrect: false },
				{
					taskId: task7_1.id,
					order: 2,
					text: 'fake-store.com',
					isCorrect: true,
				},
				{
					taskId: task7_1.id,
					order: 3,
					text: 'amazon.fake-store.com',
					isCorrect: false,
				},
				{ taskId: task7_1.id, order: 4, text: 'products', isCorrect: false },
			],
		})

		const course8 = await tx.course.create({
			data: {
				slug: 'link-checking-tools',
				title: 'Инструменты проверки ссылок',
				description: 'Сервисы для анализа безопасности',
				difficulty: Difficulty.MEDIUM,
				stageId: stages[2].id,
			},
		})

		const lesson8_1 = await tx.lesson.create({
			data: {
				title: 'VirusTotal и другие сервисы',
				order: 1,
				courseId: course8.id,
				estimatedDuration: calculateEstimatedDuration(2, 1),
			},
		})

		await tx.lessonBlock.createMany({
			data: [
				{
					lessonId: lesson8_1.id,
					order: 1,
					type: BlockType.THEORY,
					title: 'VirusTotal',
					content: `VirusTotal — бесплатный сервис Google для проверки файлов и ссылок на вирусы.

**Как работает:**
1. Вставьте ссылку на virustotal.com
2. Сервис проверит URL в 90+ антивирусах
3. Покажет результаты через 30 секунд

**Что проверяется:**
- Наличие вредоносного кода
- Фишинговые признаки
- Репутация домена
- История инцидентов

**Важно:** не вставляйте личные ссылки — они станут публичными!`,
				},
				{
					lessonId: lesson8_1.id,
					order: 2,
					type: BlockType.THEORY,
					title: 'Другие инструменты',
					content: `**URLScan.io** — анализ структуры сайта, скриншоты, технологии

**Google Safe Browsing** — встроен в Chrome, проверяет автоматически

**PhishTank** — база фишинговых сайтов, сообщество пользователей

**WHOIS** — информация о владельце домена, дате регистрации

**Признаки подозрительного домена:**
- Зарегистрирован недавно (< 1 месяца)
- Приватная регистрация
- Хостинг в странах с плохой репутацией
- Много отчетов о фишинге`,
				},
			],
		})

		const task8_1 = await tx.task.create({
			data: {
				lessonId: lesson8_1.id,
				order: 1,
				type: TaskType.SINGLE_CHOICE,
				title: 'Проверка ссылок',
				question:
					'Какой сервис НЕ предназначен для проверки безопасности ссылок?',
				points: 10,
				difficulty: Difficulty.MEDIUM,
				correctAnswerIndex: 3,
				explanation:
					'Instagram — социальная сеть, а не инструмент для проверки безопасности ссылок.', // ✅
			},
		})

		await tx.taskOption.createMany({
			data: [
				{ taskId: task8_1.id, order: 1, text: 'VirusTotal', isCorrect: false },
				{ taskId: task8_1.id, order: 2, text: 'URLScan.io', isCorrect: false },
				{ taskId: task8_1.id, order: 3, text: 'PhishTank', isCorrect: false },
				{ taskId: task8_1.id, order: 4, text: 'Instagram', isCorrect: true },
			],
		})

		// ========================
		// ЭТАП 4: ПАРОЛИ
		// ========================
		const course9 = await tx.course.create({
			data: {
				slug: 'strong-passwords',
				title: 'Создание надежных паролей',
				description: 'Как придумывать безопасные пароли',
				difficulty: Difficulty.EASY,
				stageId: stages[3].id,
			},
		})

		const lesson9_1 = await tx.lesson.create({
			data: {
				title: 'Что такое надежный пароль?',
				order: 1,
				courseId: course9.id,
				estimatedDuration: calculateEstimatedDuration(2, 1),
			},
		})

		await tx.lessonBlock.createMany({
			data: [
				{
					lessonId: lesson9_1.id,
					order: 1,
					type: BlockType.THEORY,
					title: 'Критерии надежного пароля',
					content: `**Надежный пароль должен:**
- Быть длиной минимум 12 символов
- Содержать буквы (A-Z, a-z), цифры (0-9) и спецсимволы (!@#$%)
- Не содержать словарных слов
- Быть уникальным для каждого сайта
- Не содержать личную информацию (имя, дата рождения)

**Плохие пароли:**
- password123
- qwerty
- 12345678
- ivanov1990

**Хорошие пароли:**
- Tr3e$Blu3#Moon!2024
- P@ssw0rd_G3n3r@t3d!
- My$3cur3P@ss_2024`,
				},
				{
					lessonId: lesson9_1.id,
					order: 2,
					type: BlockType.THEORY,
					title: 'Как хакеры взламывают пароли',
					content: `**Brute Force (грубая сила)** — перебор всех комбинаций
- Пароль "12345" взламывается мгновенно
- Пароль из 8 символов — за несколько часов
- Пароль из 16 символов — за миллионы лет

**Dictionary Attack (словарный)** — перебор популярных слов и комбинаций

**Credential Stuffing** — использование паролей из утечек
Если ваш пароль утек с одного сайта, хакеры попробуют его везде

**Social Engineering** — выманивание пароля обманом

**Статистика:**
- 81% взломов — из-за слабых паролей
- "123456" — самый популярный пароль в мире`,
				},
			],
		})

		const task9_1 = await tx.task.create({
			data: {
				lessonId: lesson9_1.id,
				order: 1,
				type: TaskType.SINGLE_CHOICE,
				title: 'Надежность пароля',
				question: 'Какой пароль самый надежный?',
				points: 10,
				difficulty: Difficulty.EASY,
				correctAnswerIndex: 3,
				explanation:
					'Пароль xK8#mP2$vL9@rT4! содержит буквы разного регистра, цифры и спецсимволы — это делает его очень надежным.', // ✅
			},
		})

		await tx.taskOption.createMany({
			data: [
				{ taskId: task9_1.id, order: 1, text: 'Password123', isCorrect: false },
				{ taskId: task9_1.id, order: 2, text: 'myname1990', isCorrect: false },
				{ taskId: task9_1.id, order: 3, text: 'qwerty12345', isCorrect: false },
				{
					taskId: task9_1.id,
					order: 4,
					text: 'xK8#mP2$vL9@rT4!',
					isCorrect: true,
				},
			],
		})

		const course10 = await tx.course.create({
			data: {
				slug: 'password-managers',
				title: 'Менеджеры паролей',
				description: 'Безопасное хранение паролей',
				difficulty: Difficulty.MEDIUM,
				stageId: stages[3].id,
			},
		})

		const lesson10_1 = await tx.lesson.create({
			data: {
				title: 'Зачем нужен менеджер паролей?',
				order: 1,
				courseId: course10.id,
				estimatedDuration: calculateEstimatedDuration(2, 1),
			},
		})

		await tx.lessonBlock.createMany({
			data: [
				{
					lessonId: lesson10_1.id,
					order: 1,
					type: BlockType.THEORY,
					title: 'Проблема множества паролей',
					content: `У среднего пользователя 100+ онлайн-аккаунтов. Запомнить 100 уникальных паролей невозможно.

**Плохие решения:**
- Использовать один пароль везде (опасно!)
- Записывать в блокнот (можно потерять)
- Хранить в файле на компьютере (взломают — получат все)
- Использовать простые пароли (легко взломать)

**Хорошее решение:** менеджер паролей

Это программа, которая:
- Генерирует сложные уникальные пароли
- Хранит их в зашифрованном виде
- Автоматически вводит на сайтах
- Синхронизируется между устройствами`,
				},
				{
					lessonId: lesson10_1.id,
					order: 2,
					type: BlockType.THEORY,
					title: 'Популярные менеджеры паролей',
					content: `**1Password** — $3/месяц, удобный интерфейс

**Bitwarden** — бесплатный, open source

**LastPass** — популярный, есть бесплатная версия

**Dashlane** — премиум функции, VPN

**KeePass** — полностью бесплатный, локальное хранение

**Встроенные:**
- iCloud Keychain (Apple)
- Google Password Manager
- Firefox Lockwise

**Как работает:**
1. Запоминаете 1 мастер-пароль
2. Менеджер генерирует остальные
3. Автоматически входите на сайты`,
				},
			],
		})

		const task10_1 = await tx.task.create({
			data: {
				lessonId: lesson10_1.id,
				order: 1,
				type: TaskType.SINGLE_CHOICE,
				title: 'Менеджеры паролей',
				question: 'Главное преимущество менеджера паролей:',
				points: 10,
				difficulty: Difficulty.MEDIUM,
				correctAnswerIndex: 1,
				explanation:
					'Менеджер паролей генерирует и хранит уникальные сложные пароли для каждого сайта, что критично для безопасности.', // ✅
			},
		})

		await tx.taskOption.createMany({
			data: [
				{
					taskId: task10_1.id,
					order: 1,
					text: 'Ускоряет работу компьютера',
					isCorrect: false,
				},
				{
					taskId: task10_1.id,
					order: 2,
					text: 'Позволяет использовать уникальные пароли везде',
					isCorrect: true,
				},
				{
					taskId: task10_1.id,
					order: 3,
					text: 'Защищает от вирусов',
					isCorrect: false,
				},
				{
					taskId: task10_1.id,
					order: 4,
					text: 'Увеличивает скорость интернета',
					isCorrect: false,
				},
			],
		})

		const course11 = await tx.course.create({
			data: {
				slug: 'two-factor-auth',
				title: 'Двухфакторная аутентификация',
				description: 'Дополнительный уровень защиты',
				difficulty: Difficulty.MEDIUM,
				stageId: stages[3].id,
			},
		})

		const lesson11_1 = await tx.lesson.create({
			data: {
				title: 'Что такое 2FA?',
				order: 1,
				courseId: course11.id,
				estimatedDuration: calculateEstimatedDuration(2, 1),
			},
		})

		await tx.lessonBlock.createMany({
			data: [
				{
					lessonId: lesson11_1.id,
					order: 1,
					type: BlockType.THEORY,
					title: '2FA — двойная защита',
					content: `2FA (Two-Factor Authentication) — это когда для входа нужно два подтверждения:
1. То, что вы знаете (пароль)
2. То, что у вас есть (телефон, ключ)

**Почему это важно:**
Даже если хакер узнает ваш пароль, он не сможет войти без второго фактора.

**Примеры:**
- Банковские приложения + SMS-код
- Email + код из приложения
- Соцсеть + биометрия

**Статистика:** 2FA блокирует 99.9% автоматических атак`,
				},
				{
					lessonId: lesson11_1.id,
					order: 2,
					type: BlockType.THEORY,
					title: 'Типы 2FA',
					content: `**SMS-коды** — самый простой, но наименее безопасный (SIM-swap атаки)

**Приложения-аутентификаторы** — генерируют коды офлайн (Google Authenticator, Authy)

**Push-уведомления** — подтверждение на телефоне (удобно)

**Аппаратные ключи** — физические устройства (YubiKey, самый безопасный)

**Биометрия** — отпечаток пальца, Face ID

**Рекомендация порядка безопасности:**
1. Аппаратный ключ (YubiKey)
2. Приложение-аутентификатор
3. Push-уведомление
4. SMS (лучше, чем ничего)`,
				},
			],
		})

		const task11_1 = await tx.task.create({
			data: {
				lessonId: lesson11_1.id,
				order: 1,
				type: TaskType.SINGLE_CHOICE,
				title: '2FA методы',
				question: 'Какой метод 2FA самый безопасный?',
				points: 10,
				difficulty: Difficulty.MEDIUM,
				correctAnswerIndex: 0,
				explanation:
					'Аппаратные ключи (YubiKey) — самый надежный метод 2FA, т.к. устойчивы к фишингу и не могут быть перехвачены.', // ✅
			},
		})

		await tx.taskOption.createMany({
			data: [
				{
					taskId: task11_1.id,
					order: 1,
					text: 'Аппаратный ключ (YubiKey)',
					isCorrect: true,
				},
				{ taskId: task11_1.id, order: 2, text: 'SMS-код', isCorrect: false },
				{
					taskId: task11_1.id,
					order: 3,
					text: 'Email с кодом',
					isCorrect: false,
				},
				{
					taskId: task11_1.id,
					order: 4,
					text: 'Секретный вопрос',
					isCorrect: false,
				},
			],
		})

		// ========================
		// ЭТАП 5: ВРЕДОНОСНОЕ ПО
		// ========================
		const course12 = await tx.course.create({
			data: {
				slug: 'malware-types',
				title: 'Типы вредоносного ПО',
				description: 'Вирусы, трояны, ransomware',
				difficulty: Difficulty.MEDIUM,
				stageId: stages[4].id,
			},
		})

		const lesson12_1 = await tx.lesson.create({
			data: {
				title: 'Классификация malware',
				order: 1,
				courseId: course12.id,
				estimatedDuration: calculateEstimatedDuration(2, 1),
			},
		})

		await tx.lessonBlock.createMany({
			data: [
				{
					lessonId: lesson12_1.id,
					order: 1,
					type: BlockType.THEORY,
					title: 'Основные типы',
					content: `**Вирусы** — заражают файлы, распространяются при копировании

**Черви** — распространяются сами по сети, без участия пользователя

**Трояны** — маскируются под полезные программы, выполняют скрытые действия

**Ransomware** — шифрует файлы и требует выкуп

**Spyware** — следит за действиями пользователя, крадет данные

**Adware** — показывает назойливую рекламу

**Rootkit** — скрывает присутствие malware в системе`,
				},
				{
					lessonId: lesson12_1.id,
					order: 2,
					type: BlockType.THEORY,
					title: 'Известные атаки',
					content: `**WannaCry (2017)** — ransomware, зашифровал 200 000+ компьютеров, требовал $300 в биткоинах

**NotPetya (2017)** — червь, нанес ущерб $10 млрд, парализовал компании по всему миру

**Zeus** — троян для кражи банковских данных, украл миллионы

**Stuxnet** — кибероружие, саботировало иранские ядерные объекты

**Emotet** — ботнет для рассылки спама и malware`,
				},
			],
		})

		const task12_1 = await tx.task.create({
			data: {
				lessonId: lesson12_1.id,
				order: 1,
				type: TaskType.SINGLE_CHOICE,
				title: 'Типы malware',
				question: 'Какой тип malware шифрует файлы и требует выкуп?',
				points: 10,
				difficulty: Difficulty.MEDIUM,
				correctAnswerIndex: 2,
				explanation:
					'Ransomware (шифровальщик) блокирует доступ к файлам и требует выкуп, обычно в криптовалюте.', // ✅
			},
		})

		await tx.taskOption.createMany({
			data: [
				{ taskId: task12_1.id, order: 1, text: 'Вирус', isCorrect: false },
				{ taskId: task12_1.id, order: 2, text: 'Spyware', isCorrect: false },
				{ taskId: task12_1.id, order: 3, text: 'Ransomware', isCorrect: true },
				{ taskId: task12_1.id, order: 4, text: 'Adware', isCorrect: false },
			],
		})

		const course13 = await tx.course.create({
			data: {
				slug: 'malware-protection',
				title: 'Защита от malware',
				description: 'Профилактика и удаление',
				difficulty: Difficulty.MEDIUM,
				stageId: stages[4].id,
			},
		})

		const lesson13_1 = await tx.lesson.create({
			data: {
				title: 'Как защититься от вредоносного ПО',
				order: 1,
				courseId: course13.id,
				estimatedDuration: calculateEstimatedDuration(2, 1),
			},
		})

		await tx.lessonBlock.createMany({
			data: [
				{
					lessonId: lesson13_1.id,
					order: 1,
					type: BlockType.THEORY,
					title: 'Профилактика заражения',
					content: `**1. Антивирус** — установите надежный антивирус с реалтайм защитой

**2. Обновления** — всегда устанавливайте обновления системы и программ

**3. Осторожность при скачивании:**
- Качайте только с официальных сайтов
- Проверяйте файлы в VirusTotal
- Не запускайте .exe из писем

**4. Не открывайте подозрительные вложения** в email

**5. Резервные копии** — делайте бэкапы важных файлов

**6. Блокировщик рекламы** — защищает от malvertising`,
				},
				{
					lessonId: lesson13_1.id,
					order: 2,
					type: BlockType.THEORY,
					title: 'Признаки заражения',
					content: `**Компьютер заражен, если:**
- Медленно работает без причины
- Появляются странные программы
- Браузер открывает незнакомые сайты
- Антивирус отключился сам
- Файлы пропали или зашифрованы
- Много рекламы даже без браузера
- Высокая загрузка процессора в простое

**Что делать:**
1. Отключите интернет
2. Запустите полное сканирование антивирусом
3. Используйте Malwarebytes или Dr.Web CureIt
4. В крайнем случае — переустановите систему`,
				},
			],
		})

		const task13_1 = await tx.task.create({
			data: {
				lessonId: lesson13_1.id,
				order: 1,
				type: TaskType.MULTI_CHOICE,
				title: 'Защита от malware',
				question: 'Какие действия защищают от malware? (несколько):',
				points: 15,
				difficulty: Difficulty.MEDIUM,
				explanation:
					'Антивирус, обновления и бэкапы — три столпа защиты от вредоносного ПО. Отключать Defender опасно.', // ✅
			},
		})

		await tx.taskOption.createMany({
			data: [
				{
					taskId: task13_1.id,
					order: 1,
					text: 'Установка антивируса',
					isCorrect: true,
				},
				{
					taskId: task13_1.id,
					order: 2,
					text: 'Регулярные обновления системы',
					isCorrect: true,
				},
				{
					taskId: task13_1.id,
					order: 3,
					text: 'Отключение Windows Defender для скорости',
					isCorrect: false,
				},
				{
					taskId: task13_1.id,
					order: 4,
					text: 'Резервное копирование файлов',
					isCorrect: true,
				},
			],
		})

		// ========================
		// ЭТАП 6: СОЦСЕТИ
		// ========================
		const course14 = await tx.course.create({
			data: {
				slug: 'social-media-privacy',
				title: 'Приватность в соцсетях',
				description: 'Настройка безопасности аккаунтов',
				difficulty: Difficulty.EASY,
				stageId: stages[5].id,
			},
		})

		const lesson14_1 = await tx.lesson.create({
			data: {
				title: 'Настройки приватности',
				order: 1,
				courseId: course14.id,
				estimatedDuration: calculateEstimatedDuration(2, 1),
			},
		})

		await tx.lessonBlock.createMany({
			data: [
				{
					lessonId: lesson14_1.id,
					order: 1,
					type: BlockType.THEORY,
					title: 'Почему важна приватность',
					content: `Ваши публикации в соцсетях видят:
- Работодатели при найме
- Мошенники для сбора данных
- Маркетологи для таргетинга
- Случайные незнакомцы

**Что могут узнать:**
- Где вы живете (по геометкам)
- Когда вас нет дома (посты из отпуска)
- Место работы и учебы
- Круг общения
- Привычки и интересы

**Последствия:**
- Взлом по социальной инженерии
- Кража личности
- Кибербуллинг
- Преследование`,
				},
				{
					lessonId: lesson14_1.id,
					order: 2,
					type: BlockType.THEORY,
					title: 'Как настроить приватность',
					content: `**Основные настройки:**

**ВКонтакте:**
Настройки → Приватность → Кто видит мой профиль → Только друзья

**Instagram:**
Настройки → Конфиденциальность → Закрытый аккаунт

**Facebook:**
Настройки → Конфиденциальность → Кто может видеть публикации → Друзья

**Telegram:**
Настройки → Конфиденциальность → Номер телефона/Фото → Никто

**Рекомендации:**
- Отключите геолокацию
- Скройте список друзей
- Проверьте старые публикации
- Не добавляйте незнакомцев`,
				},
			],
		})

		const task14_1 = await tx.task.create({
			data: {
				lessonId: lesson14_1.id,
				order: 1,
				type: TaskType.SINGLE_CHOICE,
				title: 'Приватность в соцсетях',
				question: 'Что безопаснее публиковать в открытом профиле?',
				points: 10,
				difficulty: Difficulty.EASY,
				correctAnswerIndex: 2,
				explanation:
					'Мемы без геометок относительно безопасны. Документы, адрес и билеты с номерами могут использоваться мошенниками.', // ✅
			},
		})

		await tx.taskOption.createMany({
			data: [
				{
					taskId: task14_1.id,
					order: 1,
					text: 'Номер паспорта',
					isCorrect: false,
				},
				{
					taskId: task14_1.id,
					order: 2,
					text: 'Домашний адрес',
					isCorrect: false,
				},
				{
					taskId: task14_1.id,
					order: 3,
					text: 'Фото с мемом без геометок',
					isCorrect: true,
				},
				{
					taskId: task14_1.id,
					order: 4,
					text: 'Фото билетов на самолет с номером бронирования',
					isCorrect: false,
				},
			],
		})

		const course15 = await tx.course.create({
			data: {
				slug: 'social-media-scams',
				title: 'Мошенничество в соцсетях',
				description: 'Распознавание обмана',
				difficulty: Difficulty.MEDIUM,
				stageId: stages[5].id,
			},
		})

		const lesson15_1 = await tx.lesson.create({
			data: {
				title: 'Типы мошенничества',
				order: 1,
				courseId: course15.id,
				estimatedDuration: calculateEstimatedDuration(2, 1),
			},
		})

		await tx.lessonBlock.create({
			data: {
				lessonId: lesson15_1.id,
				order: 1,
				type: BlockType.THEORY,
				title: 'Популярные схемы',
				content: `**1. Взлом друга:** "Привет! Срочно нужны деньги, скинь на карту"

**2. Поддельные розыгрыши:** "Поделись и выиграй iPhone!" (сбор подписчиков)

**3. Фейковые благотворительные сборы**

**4. Фишинг через личные сообщения:** "Перейди по ссылке, ты выиграл!"

**5. Вакансии с предоплатой:** "Работа на дому, сначала оплати обучение"

**6. Инвестиционные пирамиды:** "Вложи 10 000₽, получишь 100 000₽!"

**Как проверить:**
- Позвоните другу голосом
- Проверьте профиль на подлинность
- Не переходите по подозрительным ссылкам
- Не отправляйте деньги незнакомцам`,
			},
		})

		const task15_1 = await tx.task.create({
			data: {
				lessonId: lesson15_1.id,
				order: 1,
				type: TaskType.SINGLE_CHOICE,
				title: 'Мошенничество в соцсетях',
				question: 'Друг пишет "Срочно скинь 5000₽". Что делать?',
				points: 10,
				difficulty: Difficulty.MEDIUM,
				correctAnswerIndex: 1,
				explanation:
					'Аккаунт друга могли взломать. Всегда звоните голосом для проверки таких просьб.', // ✅
			},
		})

		await tx.taskOption.createMany({
			data: [
				{
					taskId: task15_1.id,
					order: 1,
					text: 'Сразу отправить деньги',
					isCorrect: false,
				},
				{
					taskId: task15_1.id,
					order: 2,
					text: 'Позвонить другу и уточнить',
					isCorrect: true,
				},
				{
					taskId: task15_1.id,
					order: 3,
					text: 'Спросить номер карты в чате',
					isCorrect: false,
				},
				{
					taskId: task15_1.id,
					order: 4,
					text: 'Попросить его позвонить',
					isCorrect: false,
				},
			],
		})

		// ========================
		// ЭТАП 7: ЛИЧНЫЕ ДАННЫЕ
		// ========================
		const course16 = await tx.course.create({
			data: {
				slug: 'personal-data',
				title: 'Защита личных данных',
				description: 'Что нельзя публиковать',
				difficulty: Difficulty.EASY,
				stageId: stages[6].id,
			},
		})

		const lesson16_1 = await tx.lesson.create({
			data: {
				title: 'Какие данные защищать',
				order: 1,
				courseId: course16.id,
				estimatedDuration: calculateEstimatedDuration(2, 1),
			},
		})

		await tx.lessonBlock.createMany({
			data: [
				{
					lessonId: lesson16_1.id,
					order: 1,
					type: BlockType.THEORY,
					title: 'Критичные данные',
					content: `**НИКОГДА не публикуйте:**
- Номер паспорта/СНИЛС
- Данные банковских карт (полный номер, CVV, PIN)
- Пароли
- Номер телефона (кроме деловых целей)
- Домашний адрес
- Геолокацию дома
- Фото документов

**С осторожностью:**
- Дата рождения (используется для восстановления паролей)
- ФИО полностью
- Email
- Место работы/учебы
- Маршруты и расписание`,
				},
				{
					lessonId: lesson16_1.id,
					order: 2,
					type: BlockType.THEORY,
					title: 'Что могут сделать с вашими данными',
					content: `**Имея ФИО + дату рождения + номер телефона:**
- Оформить микрозаем на ваше имя
- Зарегистрировать аккаунты
- Восстановить доступ к соцсетям
- Позвонить и выманить деньги под видом банка

**Имея скан паспорта:**
- Оформить кредит
- Зарегистрировать фирму
- Купить SIM-карту
- Совершить преступление от вашего имени

**Защита:**
- Не отправляйте сканы паспорта незнакомцам
- Ставьте водяной знак на документы
- Проверяйте кредитную историю раз в год
- Не публикуйте билеты с штрихкодами`,
				},
			],
		})

		const task16_1 = await tx.task.create({
			data: {
				lessonId: lesson16_1.id,
				order: 1,
				type: TaskType.MULTI_CHOICE,
				title: 'Защита данных',
				question: 'Какие данные ОПАСНО публиковать? (несколько):',
				points: 15,
				difficulty: Difficulty.EASY,
				explanation:
					'Паспорт, адрес и CVV — критичные данные, которые могут использоваться для мошенничества и кражи личности.', // ✅
			},
		})

		await tx.taskOption.createMany({
			data: [
				{
					taskId: task16_1.id,
					order: 1,
					text: 'Номер паспорта',
					isCorrect: true,
				},
				{
					taskId: task16_1.id,
					order: 2,
					text: 'Домашний адрес',
					isCorrect: true,
				},
				{
					taskId: task16_1.id,
					order: 3,
					text: 'Любимая книга',
					isCorrect: false,
				},
				{
					taskId: task16_1.id,
					order: 4,
					text: 'CVV код банковской карты',
					isCorrect: true,
				},
			],
		})

		const course17 = await tx.course.create({
			data: {
				slug: 'data-leaks',
				title: 'Утечки данных',
				description: 'Как проверить и что делать',
				difficulty: Difficulty.MEDIUM,
				stageId: stages[6].id,
			},
		})

		const lesson17_1 = await tx.lesson.create({
			data: {
				title: 'Проверка утечек',
				order: 1,
				courseId: course17.id,
				estimatedDuration: calculateEstimatedDuration(2, 1),
			},
		})

		await tx.lessonBlock.createMany({
			data: [
				{
					lessonId: lesson17_1.id,
					order: 1,
					type: BlockType.THEORY,
					title: 'Что такое утечка данных',
					content: `Утечка данных — когда хакеры взламывают сервис и публикуют базу пользователей.

**Крупнейшие утечки:**
- Yahoo (2013) — 3 миллиарда аккаунтов
- Facebook (2019) — 533 миллиона пользователей
- LinkedIn (2021) — 700 миллионов профилей
- VK (2016) — 100 миллионов аккаунтов

**Что попадает в утечки:**
- Email + пароль
- Номер телефона
- Имя и фамилия
- Дата рождения
- Адрес
- История покупок`,
				},
				{
					lessonId: lesson17_1.id,
					order: 2,
					type: BlockType.THEORY,
					title: 'Как проверить свои данные',
					content: `**HaveIBeenPwned.com** — введите email, узнаете об утечках

**LeakCheck.io** — проверка по email, телефону, логину (частично платно)

**2ip.ru/leak** — российский сервис проверки

**Что делать, если нашли утечку:**
1. Немедленно смените пароль на этом сайте
2. Смените пароли на других сайтах, где он совпадал
3. Включите 2FA
4. Проверьте активные сессии
5. Следите за банковским счетом

**Профилактика:**
- Используйте уникальные пароли везде
- Не игнорируйте уведомления о подозрительных входах`,
				},
			],
		})

		const task17_1 = await tx.task.create({
			data: {
				lessonId: lesson17_1.id,
				order: 1,
				type: TaskType.SINGLE_CHOICE,
				title: 'Утечки данных',
				question: 'Узнали, что ваш пароль от VK утек. Что делать первым?',
				points: 10,
				difficulty: Difficulty.MEDIUM,
				correctAnswerIndex: 1,
				explanation:
					'При утечке пароля его нужно немедленно сменить, пока хакеры не успели войти в аккаунт.', // ✅
			},
		})

		await tx.taskOption.createMany({
			data: [
				{
					taskId: task17_1.id,
					order: 1,
					text: 'Ничего, пусть попробуют взломать',
					isCorrect: false,
				},
				{
					taskId: task17_1.id,
					order: 2,
					text: 'Немедленно сменить пароль',
					isCorrect: true,
				},
				{
					taskId: task17_1.id,
					order: 3,
					text: 'Удалить аккаунт',
					isCorrect: false,
				},
				{
					taskId: task17_1.id,
					order: 4,
					text: 'Подождать неделю',
					isCorrect: false,
				},
			],
		})

		const course18 = await tx.course.create({
			data: {
				slug: 'vpn-encryption',
				title: 'VPN и шифрование',
				description: 'Анонимность и защита трафика',
				difficulty: Difficulty.HARD,
				stageId: stages[6].id,
			},
		})

		const lesson18_1 = await tx.lesson.create({
			data: {
				title: 'Основы VPN',
				order: 1,
				courseId: course18.id,
				estimatedDuration: calculateEstimatedDuration(2, 1),
			},
		})

		await tx.lessonBlock.createMany({
			data: [
				{
					lessonId: lesson18_1.id,
					order: 1,
					type: BlockType.THEORY,
					title: 'Что такое VPN',
					content: `VPN (Virtual Private Network) — виртуальная частная сеть. Шифрует ваш трафик и скрывает IP-адрес.

**Как работает:**
1. Включаете VPN
2. Весь трафик идет через зашифрованный туннель к VPN-серверу
3. С точки зрения сайтов вы заходите с IP VPN-сервера
4. Провайдер видит только VPN-соединение, не сайты

**Зачем нужен:**
- Обход блокировок
- Защита в публичном Wi-Fi
- Скрыть действия от провайдера
- Доступ к региональному контенту`,
				},
				{
					lessonId: lesson18_1.id,
					order: 2,
					type: BlockType.THEORY,
					title: 'Выбор VPN',
					content: `**Платные (надежные):**
- NordVPN
- ExpressVPN
- ProtonVPN
- Mullvad

**Бесплатные (с ограничениями):**
- ProtonVPN Free
- Windscribe (10 ГБ/месяц)

**НЕ используйте:**
- VPN из подозрительных приложений
- Бесплатные китайские VPN
- VPN с плохими отзывами

**Критерии выбора:**
- Политика no-logs (не хранят логи)
- Скорость соединения
- Количество серверов
- Поддержка устройств
- Цена`,
				},
			],
		})

		const task18_1 = await tx.task.create({
			data: {
				lessonId: lesson18_1.id,
				order: 1,
				type: TaskType.SINGLE_CHOICE,
				title: 'VPN',
				question: 'Главная задача VPN:',
				points: 15,
				difficulty: Difficulty.HARD,
				correctAnswerIndex: 1,
				explanation:
					'VPN шифрует весь интернет-трафик и скрывает ваш IP-адрес, защищая от слежки и перехвата данных.', // ✅
			},
		})

		await tx.taskOption.createMany({
			data: [
				{
					taskId: task18_1.id,
					order: 1,
					text: 'Ускорить интернет',
					isCorrect: false,
				},
				{
					taskId: task18_1.id,
					order: 2,
					text: 'Зашифровать трафик и скрыть IP',
					isCorrect: true,
				},
				{
					taskId: task18_1.id,
					order: 3,
					text: 'Заблокировать рекламу',
					isCorrect: false,
				},
				{
					taskId: task18_1.id,
					order: 4,
					text: 'Увеличить скорость скачивания',
					isCorrect: false,
				},
			],
		})

		// ========================
		// ЭТАП 8: ПРОДВИНУТЫЙ
		// ========================
		const course19 = await tx.course.create({
			data: {
				slug: 'advanced-threats',
				title: 'Продвинутые угрозы',
				description: 'APT, Zero-day, криптоджекинг',
				difficulty: Difficulty.HARD,
				stageId: stages[7].id,
			},
		})

		const lesson19_1 = await tx.lesson.create({
			data: {
				title: 'APT атаки',
				order: 1,
				courseId: course19.id,
				estimatedDuration: calculateEstimatedDuration(2, 1),
			},
		})

		await tx.lessonBlock.create({
			data: {
				lessonId: lesson19_1.id,
				order: 1,
				type: BlockType.THEORY,
				title: 'Advanced Persistent Threats',
				content: `APT (Advanced Persistent Threat) — целенаправленные долгосрочные кибератаки на крупные организации.

**Характеристики:**
- Спонсируются государствами
- Используют zero-day уязвимости
- Незаметны месяцами
- Крадут стратегическую информацию

**Известные группы:**
- APT28 (Fancy Bear) — Россия
- APT29 (Cozy Bear) — Россия  
- APT1 — Китай
- Lazarus Group — Северная Корея

**Примеры:**
- Stuxnet — саботаж иранских центрифуг
- SolarWinds (2020) — взлом через обновление ПО

**Защита:** обычному пользователю не грозит, целятся на правительства и корпорации`,
			},
		})

		const task19_1 = await tx.task.create({
			data: {
				lessonId: lesson19_1.id,
				order: 1,
				type: TaskType.SINGLE_CHOICE,
				title: 'APT атаки',
				question: 'Что характерно для APT атак?',
				points: 20,
				difficulty: Difficulty.HARD,
				correctAnswerIndex: 2,
				explanation:
					'APT (Advanced Persistent Threat) — это сложные долгосрочные атаки, которые могут длиться месяцами незамеченными.', // ✅
			},
		})

		await tx.taskOption.createMany({
			data: [
				{
					taskId: task19_1.id,
					order: 1,
					text: 'Массовая рассылка спама',
					isCorrect: false,
				},
				{
					taskId: task19_1.id,
					order: 2,
					text: 'Быстрый взлом за несколько часов',
					isCorrect: false,
				},
				{
					taskId: task19_1.id,
					order: 3,
					text: 'Долгосрочное скрытое проникновение в сеть',
					isCorrect: true,
				},
				{
					taskId: task19_1.id,
					order: 4,
					text: 'Показ рекламы',
					isCorrect: false,
				},
			],
		})

		const course20 = await tx.course.create({
			data: {
				slug: 'incident-response',
				title: 'Реагирование на инциденты',
				description: 'Что делать при взломе',
				difficulty: Difficulty.HARD,
				stageId: stages[7].id,
			},
		})

		const lesson20_1 = await tx.lesson.create({
			data: {
				title: 'План действий при взломе',
				order: 1,
				courseId: course20.id,
				estimatedDuration: calculateEstimatedDuration(2, 1),
			},
		})

		await tx.lessonBlock.createMany({
			data: [
				{
					lessonId: lesson20_1.id,
					order: 1,
					type: BlockType.THEORY,
					title: 'Признаки взлома',
					content: `**Аккаунт взломали, если:**
- Появились публикации, которые вы не делали
- Изменился пароль
- Письмо "Ваш пароль изменен" (хотя вы не меняли)
- Активные сессии из других городов
- Друзья получают спам от вас

**Компьютер взломали, если:**
- Файлы зашифрованы (ransomware)
- Незнакомые программы в автозагрузке
- Веб-камера включается сама
- Деньги пропали со счета
- Высокий трафик без причины`,
				},
				{
					lessonId: lesson20_1.id,
					order: 2,
					type: BlockType.THEORY,
					title: 'Что делать немедленно',
					content: `**Шаг 1:** Отключите устройство от интернета

**Шаг 2:** Смените пароли с другого устройства

**Шаг 3:** Завершите все активные сессии

**Шаг 4:** Включите 2FA

**Шаг 5:** Проверьте компьютер антивирусом

**Шаг 6:** Уведомите друзей, если аккаунт рассылал спам

**Шаг 7:** Если украли деньги — заблокируйте карту, обратитесь в банк

**Шаг 8:** Сохраните доказательства (скриншоты)

**Шаг 9:** Обратитесь в техподдержку сервиса

**Шаг 10:** Подайте заявление в полицию (при краже денег)`,
				},
			],
		})

		const task20_1 = await tx.task.create({
			data: {
				lessonId: lesson20_1.id,
				order: 1,
				type: TaskType.SINGLE_CHOICE,
				title: 'Действия при взломе',
				question: 'Что делать ПЕРВЫМ, если аккаунт взломали?',
				points: 15,
				difficulty: Difficulty.HARD,
				correctAnswerIndex: 1,
				explanation:
					'Сначала изолируйте устройство от сети и смените пароль с чистого устройства, чтобы предотвратить дальнейший ущерб.', // ✅
			},
		})

		await tx.taskOption.createMany({
			data: [
				{
					taskId: task20_1.id,
					order: 1,
					text: 'Написать в техподдержку',
					isCorrect: false,
				},
				{
					taskId: task20_1.id,
					order: 2,
					text: 'Отключить интернет и сменить пароль с другого устройства',
					isCorrect: true,
				},
				{
					taskId: task20_1.id,
					order: 3,
					text: 'Удалить аккаунт',
					isCorrect: false,
				},
				{
					taskId: task20_1.id,
					order: 4,
					text: 'Подождать несколько дней',
					isCorrect: false,
				},
			],
		})

		// ========================
		// ДОСТИЖЕНИЯ
		// ========================
		console.log('🏆 Creating achievements...')
		await tx.achievement.createMany({
			data: [
				{
					code: 'FIRST_LOGIN',
					title: 'Первый вход',
					description: 'Зарегистрировались в системе',
					icon: 'log-in',
				},
				{
					code: 'FIRST_LESSON',
					title: 'Первый урок',
					description: 'Завершили первый урок',
					icon: 'book-open',
				},
				{
					code: 'PHISHING_MASTER',
					title: 'Мастер фишинга',
					description: 'Прошли курс по фишингу',
					icon: 'fish',
				},
				{
					code: 'PASSWORD_EXPERT',
					title: 'Эксперт паролей',
					description: 'Завершили все курсы по паролям',
					icon: 'key',
				},
				{
					code: 'SECURITY_NOVICE',
					title: 'Новичок безопасности',
					description: 'Прошли первый этап обучения',
					icon: 'shield',
				},
				{
					code: 'SECURITY_ADVANCED',
					title: 'Продвинутый пользователь',
					description: 'Прошли 4 этапа обучения',
					icon: 'award',
				},
				{
					code: 'SECURITY_EXPERT',
					title: 'Эксперт безопасности',
					description: 'Прошли все 8 этапов',
					icon: 'trophy',
				},
				{
					code: 'PERFECT_SCORE',
					title: 'Идеальный результат',
					description: 'Решили 50 заданий подряд без ошибок',
					icon: 'star',
				},
				{
					code: 'FAST_LEARNER',
					title: 'Быстрый ученик',
					description: 'Завершили курс за 1 день',
					icon: 'zap',
				},
				{
					code: 'CERTIFIED',
					title: 'Сертифицированный',
					description: 'Получили первый сертификат',
					icon: 'file-badge',
				},
			],
		})

		// ========================
		// ТЕСТЫ
		// ========================
		console.log('📝 Creating tests...')

		const test1 = await tx.test.create({
			data: {
				title: 'Итоговый тест: Основы безопасности',
				description: 'Проверка знаний по основам цифровой безопасности',
				courseId: course1.id,
				passingScore: 70,
			},
		})

		const tq1_1 = await tx.testQuestion.create({
			data: {
				testId: test1.id,
				order: 1,
				text: 'Что является основной функцией антивируса?',
				type: TaskType.SINGLE_CHOICE,
				correctAnswerIndex: 1,
			},
		})

		await tx.testQuestionOption.createMany({
			data: [
				{
					testQuestionId: tq1_1.id,
					order: 1,
					text: 'Ускорение компьютера',
					isCorrect: false,
				},
				{
					testQuestionId: tq1_1.id,
					order: 2,
					text: 'Защита от вредоносного ПО',
					isCorrect: true,
				},
				{
					testQuestionId: tq1_1.id,
					order: 3,
					text: 'Увеличение скорости интернета',
					isCorrect: false,
				},
			],
		})

		const tq1_2 = await tx.testQuestion.create({
			data: {
				testId: test1.id,
				order: 2,
				text: 'Как определить защищенное соединение?',
				type: TaskType.SINGLE_CHOICE,
				correctAnswerIndex: 0,
			},
		})

		await tx.testQuestionOption.createMany({
			data: [
				{
					testQuestionId: tq1_2.id,
					order: 1,
					text: 'Замочек и https:// в адресной строке',
					isCorrect: true,
				},
				{
					testQuestionId: tq1_2.id,
					order: 2,
					text: 'Красивый дизайн сайта',
					isCorrect: false,
				},
				{
					testQuestionId: tq1_2.id,
					order: 3,
					text: 'Быстрая загрузка страницы',
					isCorrect: false,
				},
			],
		})

		const test2 = await tx.test.create({
			data: {
				title: 'Итоговый тест: Фишинг',
				description: 'Проверка навыков распознавания фишинга',
				courseId: course4.id,
				passingScore: 80,
			},
		})

		const tq2_1 = await tx.testQuestion.create({
			data: {
				testId: test2.id,
				order: 1,
				text: 'Какой признак точно указывает на фишинговое письмо?',
				type: TaskType.SINGLE_CHOICE,
				correctAnswerIndex: 2,
			},
		})

		await tx.testQuestionOption.createMany({
			data: [
				{
					testQuestionId: tq2_1.id,
					order: 1,
					text: 'Письмо от друга',
					isCorrect: false,
				},
				{
					testQuestionId: tq2_1.id,
					order: 2,
					text: 'Персональное обращение',
					isCorrect: false,
				},
				{
					testQuestionId: tq2_1.id,
					order: 3,
					text: 'Требование срочно ввести пароль по ссылке',
					isCorrect: true,
				},
			],
		})

		const tq2_2 = await tx.testQuestion.create({
			data: {
				testId: test2.id,
				order: 2,
				text: 'Как правильно проверить ссылку в письме?',
				type: TaskType.SINGLE_CHOICE,
				correctAnswerIndex: 1,
			},
		})

		await tx.testQuestionOption.createMany({
			data: [
				{
					testQuestionId: tq2_2.id,
					order: 1,
					text: 'Сразу нажать на неё',
					isCorrect: false,
				},
				{
					testQuestionId: tq2_2.id,
					order: 2,
					text: 'Навести мышкой и посмотреть URL',
					isCorrect: true,
				},
				{
					testQuestionId: tq2_2.id,
					order: 3,
					text: 'Скопировать в Google',
					isCorrect: false,
				},
			],
		})

		const test3 = await tx.test.create({
			data: {
				title: 'Итоговый тест: Пароли',
				description: 'Проверка знаний о безопасности паролей',
				courseId: course9.id,
				passingScore: 75,
			},
		})

		const tq3_1 = await tx.testQuestion.create({
			data: {
				testId: test3.id,
				order: 1,
				text: 'Какой пароль самый надежный?',
				type: TaskType.SINGLE_CHOICE,
				correctAnswerIndex: 3,
			},
		})

		await tx.testQuestionOption.createMany({
			data: [
				{
					testQuestionId: tq3_1.id,
					order: 1,
					text: 'password123',
					isCorrect: false,
				},
				{
					testQuestionId: tq3_1.id,
					order: 2,
					text: 'qwerty',
					isCorrect: false,
				},
				{
					testQuestionId: tq3_1.id,
					order: 3,
					text: '12345678',
					isCorrect: false,
				},
				{
					testQuestionId: tq3_1.id,
					order: 4,
					text: 'xK8#mP2$vL9@',
					isCorrect: true,
				},
			],
		})

		const tq3_2 = await tx.testQuestion.create({
			data: {
				testId: test3.id,
				order: 2,
				text: 'Какой метод 2FA самый безопасный?',
				type: TaskType.SINGLE_CHOICE,
				correctAnswerIndex: 0,
			},
		})

		await tx.testQuestionOption.createMany({
			data: [
				{
					testQuestionId: tq3_2.id,
					order: 1,
					text: 'Аппаратный ключ',
					isCorrect: true,
				},
				{
					testQuestionId: tq3_2.id,
					order: 2,
					text: 'SMS-код',
					isCorrect: false,
				},
				{
					testQuestionId: tq3_2.id,
					order: 3,
					text: 'Email с кодом',
					isCorrect: false,
				},
			],
		})

		const test4 = await tx.test.create({
			data: {
				title: 'Итоговый тест: Вредоносное ПО',
				description: 'Проверка знаний о malware',
				courseId: course12.id,
				passingScore: 80,
			},
		})

		const tq4_1 = await tx.testQuestion.create({
			data: {
				testId: test4.id,
				order: 1,
				text: 'Какой тип malware шифрует файлы и требует выкуп?',
				type: TaskType.SINGLE_CHOICE,
				correctAnswerIndex: 2,
			},
		})

		await tx.testQuestionOption.createMany({
			data: [
				{ testQuestionId: tq4_1.id, order: 1, text: 'Virus', isCorrect: false },
				{
					testQuestionId: tq4_1.id,
					order: 2,
					text: 'Trojan',
					isCorrect: false,
				},
				{
					testQuestionId: tq4_1.id,
					order: 3,
					text: 'Ransomware',
					isCorrect: true,
				},
			],
		})

		const test5 = await tx.test.create({
			data: {
				title: 'Итоговый тест: Защита данных',
				description: 'Проверка знаний о приватности',
				courseId: course16.id,
				passingScore: 75,
			},
		})

		const tq5_1 = await tx.testQuestion.create({
			data: {
				testId: test5.id,
				order: 1,
				text: 'Что ОПАСНО публиковать в соцсетях?',
				type: TaskType.SINGLE_CHOICE,
				correctAnswerIndex: 1,
			},
		})

		await tx.testQuestionOption.createMany({
			data: [
				{
					testQuestionId: tq5_1.id,
					order: 1,
					text: 'Фото с мемом',
					isCorrect: false,
				},
				{
					testQuestionId: tq5_1.id,
					order: 2,
					text: 'Номер паспорта',
					isCorrect: true,
				},
				{
					testQuestionId: tq5_1.id,
					order: 3,
					text: 'Любимую книгу',
					isCorrect: false,
				},
			],
		})

		// ========================
		// ДЕМО ПРОГРЕСС
		// ========================
		console.log('📊 Creating demo progress for user...')

		// Прогресс по курсам
		await tx.courseProgress.createMany({
			data: [
				{
					userId: demoUser.id,
					courseId: course1.id,
					progress: 100,
					totalXp: 35,
				},
				{
					userId: demoUser.id,
					courseId: course2.id,
					progress: 50,
					totalXp: 10,
				},
				{
					userId: demoUser.id,
					courseId: course4.id,
					progress: 75,
					totalXp: 25,
				},
				{
					userId: demoUser.id,
					courseId: course9.id,
					progress: 30,
					totalXp: 10,
				},
			],
		})

		// Завершенные уроки
		await tx.completedLesson.createMany({
			data: [
				{ userId: demoUser.id, lessonId: lesson1_1.id },
				{ userId: demoUser.id, lessonId: lesson1_2.id },
				{ userId: demoUser.id, lessonId: lesson4_1.id },
			],
		})

		// Попытки выполнения заданий
		await tx.taskAttempt.createMany({
			data: [
				{
					userId: demoUser.id,
					taskId: task1_1.id,
					selectedOptionIds: [
						(await tx.taskOption.findFirst({
							where: { taskId: task1_1.id, isCorrect: true },
						}))!.id,
					],
					isCorrect: true,
					awardedXp: 10,
				},
				{
					userId: demoUser.id,
					taskId: task1_2.id,
					selectedOptionIds: [
						(await tx.taskOption.findFirst({
							where: { taskId: task1_2.id, isCorrect: true, order: 2 },
						}))!.id,
						(await tx.taskOption.findFirst({
							where: { taskId: task1_2.id, isCorrect: true, order: 3 },
						}))!.id,
					],
					isCorrect: true,
					awardedXp: 15,
				},
				{
					userId: demoUser.id,
					taskId: task1_3.id,
					selectedOptionIds: [
						(await tx.taskOption.findFirst({
							where: { taskId: task1_3.id, isCorrect: true },
						}))!.id,
					],
					isCorrect: true,
					awardedXp: 10,
				},
				{
					userId: demoUser.id,
					taskId: task4_1.id,
					selectedOptionIds: [
						(await tx.taskOption.findFirst({
							where: { taskId: task4_1.id, isCorrect: true },
						}))!.id,
					],
					isCorrect: true,
					awardedXp: 10,
				},
				{
					userId: demoUser.id,
					taskId: task4_2.id,
					selectedOptionIds: [
						(await tx.taskOption.findFirst({
							where: { taskId: task4_2.id, order: 1 },
						}))!.id,
					],
					isCorrect: false,
					awardedXp: 0,
				},
			],
		})

		// Результаты тестов
		await tx.testResult.createMany({
			data: [
				{
					userId: demoUser.id,
					testId: test1.id,
					score: 100,
					totalQuestions: 2,
					correctAnswers: 2,
					passed: true,
					time: 962,
				},
				{
					userId: demoUser.id,
					testId: test2.id,
					score: 50,
					totalQuestions: 2,
					correctAnswers: 1,
					passed: false,
					time: 482,
				},
			],
		})

		// Выданные достижения
		const achievements = await tx.achievement.findMany()
		await tx.userAchievement.createMany({
			data: [
				{
					userId: demoUser.id,
					achievementId: achievements.find(a => a.code === 'FIRST_LOGIN')!.id,
				},
				{
					userId: demoUser.id,
					achievementId: achievements.find(a => a.code === 'FIRST_LESSON')!.id,
				},
				{
					userId: demoUser.id,
					achievementId: achievements.find(a => a.code === 'SECURITY_NOVICE')!
						.id,
				},
			],
		})

		// Выдать сертификат за первый курс
		await tx.certificate.create({
			data: {
				userId: demoUser.id,
				courseId: course1.id,
				certificateNumber: `CERT-${new Date().getFullYear()}1230-00001`,
			},
		})

		console.log('✅ SEED COMPLETED!')
		console.log('\n📊 ИТОГОВАЯ СТАТИСТИКА:')
		console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
		console.log('👥 Пользователи: 2')
		console.log('   ├─ demo@safe.net (с прогрессом)')
		console.log('   └─ admin@safe.net')
		console.log('')
		console.log('📚 Структура обучения:')
		console.log('   ├─ Этапов: 8')
		console.log('   ├─ Курсов: 20')
		console.log('   ├─ Уроков: 20')
		console.log('   ├─ Теоретических блоков: 40+')
		console.log('   ├─ Практических заданий: 20+')
		console.log('   └─ Тестов: 5')
		console.log('')
		console.log('🎯 Этапы:')
		console.log('   1️⃣  Основы безопасности (3 курса)')
		console.log('   2️⃣  Фишинг и мошенничество (3 курса)')
		console.log('   3️⃣  Опасные ссылки (2 курса)')
		console.log('   4️⃣  Пароли (3 курса)')
		console.log('   5️⃣  Вредоносное ПО (2 курса)')
		console.log('   6️⃣  Соцсети (2 курса)')
		console.log('   7️⃣  Личные данные (3 курса)')
		console.log('   8️⃣  Продвинутый уровень (2 курса)')
		console.log('')
		console.log('🏆 Достижения: 10')
		console.log('📜 Демо сертификат: 1')
		console.log('')
		console.log('📊 Демо прогресс:')
		console.log('   ├─ Основы безопасности: 100% ✅')
		console.log('   ├─ Безопасный серфинг: 50%')
		console.log('   ├─ Введение в фишинг: 75%')
		console.log('   └─ Надежные пароли: 30%')
		console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
		console.log('\n🎉 База данных готова к использованию!')
	})
}

main()
	.catch(e => {
		console.error('❌ Seed error:', e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
