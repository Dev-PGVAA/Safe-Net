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
				name: 'Demo User',
				password: hashedPassword,
				rights: [Role.USER],
			},
		})

		const adminUser = await tx.user.upsert({
			where: { email: 'admin@safe.net' },
			update: {},
			create: {
				email: 'admin@safe.net',
				name: 'Admin',
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
					title: 'Security Basics',
					subtitle: 'Fundamental knowledge • 3 courses',
					icon: 'shield',
				},
			}),
			tx.stage.create({
				data: {
					order: 2,
					slug: 'phishing',
					title: 'Phishing & Fraud',
					subtitle: 'Recognizing threats • 3 courses',
					icon: 'fish',
				},
			}),
			tx.stage.create({
				data: {
					order: 3,
					slug: 'dangerous-links',
					title: 'Dangerous Links',
					subtitle: 'Checking URLs • 2 courses',
					icon: 'link-2-off',
				},
			}),
			tx.stage.create({
				data: {
					order: 4,
					slug: 'passwords',
					title: 'Passwords',
					subtitle: 'Reliable authentication • 3 courses',
					icon: 'lock',
				},
			}),
			tx.stage.create({
				data: {
					order: 5,
					slug: 'malware',
					title: 'Malware',
					subtitle: 'Protection from threats • 2 courses',
					icon: 'bug',
				},
			}),
			tx.stage.create({
				data: {
					order: 6,
					slug: 'social-media',
					title: 'Social Media',
					subtitle: 'Staying safe online • 2 courses',
					icon: 'users',
				},
			}),
			tx.stage.create({
				data: {
					order: 7,
					slug: 'privacy',
					title: 'Personal Data',
					subtitle: 'Privacy • 3 courses',
					icon: 'eye-off',
				},
			}),
			tx.stage.create({
				data: {
					order: 8,
					slug: 'advanced',
					title: 'Advanced Level',
					subtitle: 'For experts • 2 courses',
					icon: 'zap',
				},
			}),
		])

		console.log('🎓 Creating courses for all stages...')

		// ========================
		// STAGE 1: SECURITY BASICS
		// ========================
		const course1 = await tx.course.create({
			data: {
				slug: 'digital-safety-basics',
				title: 'Digital Safety Basics',
				description: 'Fundamental principles of protection online',
				difficulty: Difficulty.EASY,
				stageId: stages[0].id,
			},
		})

		const lesson1_1 = await tx.lesson.create({
			data: {
				title: 'What Is Digital Safety?',
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
					title: 'Introduction to Digital Safety',
					content: `Digital safety is the protection of your data, devices, and personal information online. In today's world, we store photos, messages, banking details, and much more on our phones and computers.

Without proper protection, attackers can:
- Steal your money
- Gain access to your private messages
- Use your data for fraud
- Lock you out of your own files`,
				},
				{
					lessonId: lesson1_1.id,
					order: 2,
					type: BlockType.THEORY,
					title: 'Main Threats',
					content: `**Viruses and malware** — programs that infect your device and steal data.

**Phishing** — scammers pose as banks or well-known companies to trick you into revealing your passwords.

**Surveillance** — collecting information about you without your consent.

**Data breaches** — when companies lose databases containing users' passwords.`,
				},
				{
					lessonId: lesson1_1.id,
					order: 3,
					type: BlockType.THEORY,
					title: 'How to Protect Yourself?',
					content: `1. Use strong passwords
2. Turn on two-factor authentication
3. Install system updates
4. Don't open suspicious links
5. Use antivirus software
6. Back up your important files`,
				},
			],
		})

		const task1_1 = await tx.task.create({
			data: {
				lessonId: lesson1_1.id,
				order: 1,
				type: TaskType.SINGLE_CHOICE,
				title: 'Main Threats',
				question: 'Which of these is NOT a digital safety threat?',
				points: 10,
				difficulty: Difficulty.EASY,
				correctAnswerIndex: 2,
				explanation:
					'Operating system updates are not a threat — on the contrary, they close vulnerabilities and protect against attacks.',
			},
		})

		await tx.taskOption.createMany({
			data: [
				{
					taskId: task1_1.id,
					order: 1,
					text: 'A phishing email from a "bank"',
					isCorrect: false,
				},
				{
					taskId: task1_1.id,
					order: 2,
					text: 'A virus on a USB drive',
					isCorrect: false,
				},
				{
					taskId: task1_1.id,
					order: 3,
					text: 'An operating system update',
					isCorrect: true,
				},
				{
					taskId: task1_1.id,
					order: 4,
					text: 'An account hack',
					isCorrect: false,
				},
			],
		})

		const task1_2 = await tx.task.create({
			data: {
				lessonId: lesson1_1.id,
				order: 2,
				type: TaskType.MULTI_CHOICE,
				title: 'Protection Methods',
				question: 'Select the correct protection methods (multiple answers):',
				points: 15,
				difficulty: Difficulty.EASY,
				explanation:
					'Two-factor authentication and security updates are the main protection methods. Using one password everywhere and disabling antivirus make you vulnerable.',
			},
		})

		await tx.taskOption.createMany({
			data: [
				{
					taskId: task1_2.id,
					order: 1,
					text: 'Use one password everywhere',
					isCorrect: false,
				},
				{
					taskId: task1_2.id,
					order: 2,
					text: 'Enable two-factor authentication',
					isCorrect: true,
				},
				{
					taskId: task1_2.id,
					order: 3,
					text: 'Install security updates',
					isCorrect: true,
				},
				{
					taskId: task1_2.id,
					order: 4,
					text: 'Disable antivirus to speed up the PC',
					isCorrect: false,
				},
			],
		})

		const lesson1_2 = await tx.lesson.create({
			data: {
				title: 'Antivirus and Updates',
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
					title: 'Why Do You Need Antivirus?',
					content: `Antivirus is software that protects your computer from malware. It works like a guard, checking all files and programs for threats.

**What antivirus does:**
- Scans files as they're downloaded
- Blocks dangerous websites
- Removes detected viruses
- Protects in real time

**Popular antivirus software:** Windows Defender (built into Windows), Kaspersky, ESET, Avast.`,
				},
				{
					lessonId: lesson1_2.id,
					order: 2,
					type: BlockType.THEORY,
					title: 'System Updates',
					content: `Updates close vulnerabilities in the operating system. Hackers constantly search for weak spots, and developers release "patches" to fix them.

**Why this matters:**
- In 2017 the WannaCry virus infected 200,000 computers by exploiting a vulnerability a patch already existed for
- Outdated systems are an easy target for attacks
- Updates also improve performance

**How to enable automatic updates:**
Windows: Settings → Update & Security → Automatic
macOS: System Settings → Software Update → Automatic`,
				},
			],
		})

		const task1_3 = await tx.task.create({
			data: {
				lessonId: lesson1_2.id,
				order: 1,
				type: TaskType.SINGLE_CHOICE,
				title: 'The Role of Antivirus',
				question: "What is antivirus software's main function?",
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
					text: 'Speed up the computer',
					isCorrect: false,
				},
				{
					taskId: task1_3.id,
					order: 2,
					text: 'Detect and block viruses',
					isCorrect: true,
				},
				{
					taskId: task1_3.id,
					order: 3,
					text: 'Increase internet speed',
					isCorrect: false,
				},
				{
					taskId: task1_3.id,
					order: 4,
					text: 'Delete unnecessary files',
					isCorrect: false,
				},
			],
		})

		const course2 = await tx.course.create({
			data: {
				slug: 'safe-browsing',
				title: 'Safe Web Browsing',
				description: 'How to use your browser safely',
				difficulty: Difficulty.EASY,
				stageId: stages[0].id,
			},
		})

		const lesson2_1 = await tx.lesson.create({
			data: {
				title: 'HTTPS and Secure Connections',
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
					title: 'What Is HTTPS?',
					content: `HTTPS is a secure version of the HTTP protocol. The "S" stands for Secure.

**The difference:**
- HTTP — data is transmitted as plain text
- HTTPS — data is encrypted

**How to check:**
Look at your browser's address bar. There should be a lock icon 🔒 and "https://" at the start of the URL.

**When this is critical:**
- Online banking
- Online shopping
- Entering passwords
- Private messaging`,
				},
				{
					lessonId: lesson2_1.id,
					order: 2,
					type: BlockType.THEORY,
					title: 'The Danger of Public Wi-Fi',
					content: `In cafes, airports, and other places with free Wi-Fi, your data can be intercepted.

**What a hacker can steal on a public network:**
- Social media passwords
- Bank card details
- Private messages
- Cookies and sessions

**How to protect yourself:**
1. Use a VPN (virtual private network)
2. Don't enter passwords on public Wi-Fi
3. Turn off auto-connect to networks
4. Use mobile data for important transactions`,
				},
			],
		})

		const task2_1 = await tx.task.create({
			data: {
				lessonId: lesson2_1.id,
				order: 1,
				type: TaskType.SINGLE_CHOICE,
				title: 'A Secure Connection',
				question: 'What sign indicates a secure connection?',
				points: 10,
				difficulty: Difficulty.EASY,
				correctAnswerIndex: 1,
				explanation:
					'A lock icon 🔒 and the https:// prefix indicate data is encrypted using the SSL/TLS protocol.',
			},
		})

		await tx.taskOption.createMany({
			data: [
				{
					taskId: task2_1.id,
					order: 1,
					text: 'The site loads quickly',
					isCorrect: false,
				},
				{
					taskId: task2_1.id,
					order: 2,
					text: 'The address bar shows a lock icon and https://',
					isCorrect: true,
				},
				{
					taskId: task2_1.id,
					order: 3,
					text: 'The site has a nice design',
					isCorrect: false,
				},
				{
					taskId: task2_1.id,
					order: 4,
					text: 'The site is in English',
					isCorrect: false,
				},
			],
		})

		const course3 = await tx.course.create({
			data: {
				slug: 'device-security',
				title: 'Device Protection',
				description: 'Smartphone and computer security',
				difficulty: Difficulty.MEDIUM,
				stageId: stages[0].id,
			},
		})

		const lesson3_1 = await tx.lesson.create({
			data: {
				title: 'Screen Lock and Biometrics',
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
					title: 'Why Screen Lock Matters',
					content: `Screen lock is the first line of defense for your device. If your phone ends up in the wrong hands, the lock prevents access to your data.

**Types of lock:**
- PIN code (4-6 digits)
- Pattern lock
- Fingerprint
- Face ID / face recognition
- Password

**What the lock protects:**
- Photos and videos
- Messenger conversations
- Banking apps
- Email and social media
- Files and documents`,
				},
				{
					lessonId: lesson3_1.id,
					order: 2,
					type: BlockType.THEORY,
					title: 'Biometrics: Pros and Cons',
					content: `**Advantages of biometrics:**
- Fast access to your device
- Hard to fake
- No password to remember
- Convenient to use

**Disadvantages:**
- Can be unlocked while you sleep
- You can't change your fingerprint
- If leaked, biometric data is compromised forever

**Recommendation:**
Use biometrics together with a PIN. If one method is compromised, the other still protects your data.`,
				},
			],
		})

		const task3_1 = await tx.task.create({
			data: {
				lessonId: lesson3_1.id,
				order: 1,
				type: TaskType.SINGLE_CHOICE,
				title: 'Lock Methods',
				question: 'Which lock method is the most secure?',
				points: 10,
				difficulty: Difficulty.MEDIUM,
				correctAnswerIndex: 3,
				explanation:
					'Combining biometrics with a strong PIN creates two independent layers of protection.',
			},
		})

		await tx.taskOption.createMany({
			data: [
				{
					taskId: task3_1.id,
					order: 1,
					text: 'Pattern lock',
					isCorrect: false,
				},
				{
					taskId: task3_1.id,
					order: 2,
					text: 'Simple PIN 1234',
					isCorrect: false,
				},
				{
					taskId: task3_1.id,
					order: 3,
					text: 'Fingerprint',
					isCorrect: false,
				},
				{
					taskId: task3_1.id,
					order: 4,
					text: 'Biometrics + a strong PIN',
					isCorrect: true,
				},
			],
		})

		// ========================
		// STAGE 2: PHISHING
		// ========================
		const course4 = await tx.course.create({
			data: {
				slug: 'phishing-basics',
				title: 'Introduction to Phishing',
				description: 'Learning to recognize phishing attacks',
				difficulty: Difficulty.MEDIUM,
				stageId: stages[1].id,
			},
		})

		const lesson4_1 = await tx.lesson.create({
			data: {
				title: 'What Is Phishing?',
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
					title: 'Defining Phishing',
					content: `Phishing is a type of fraud where attackers pose as trusted organizations to trick you into revealing:
- Passwords
- Bank card details
- Personal information
- Money

**Where the name comes from:**
The word "phishing" comes from "fishing." Scammers "cast a line" in the form of a fake message and wait to see who "bites."

**Statistics:**
- 90% of cyberattacks start with phishing
- The average damage from a single attack is $1.6 million
- 3.4 billion phishing emails are sent every day`,
				},
				{
					lessonId: lesson4_1.id,
					order: 2,
					type: BlockType.THEORY,
					title: 'Types of Phishing',
					content: `**Email phishing** — fake emails from "banks" and "support teams"

**Smishing (SMS phishing)** — fraudulent texts: "Your package is waiting for pickup, follow this link"

**Vishing (voice phishing)** — calls claiming to be from a bank, asking you to read out a code from an SMS

**Spear phishing** — a targeted attack against a specific person (often executives)

**Whaling** — an attack targeting top company executives`,
				},
				{
					lessonId: lesson4_1.id,
					order: 3,
					type: BlockType.THEORY,
					title: 'Signs of Phishing',
					content: `🚩 **Urgency** — "Your account will be locked in 24 hours!"

🚩 **Threats** — "If you don't confirm your details, your account will be closed"

🚩 **An offer that's too good** — "You've won an iPhone!"

🚩 **Errors in the text** — spelling and grammar mistakes

🚩 **A strange sender address** — support@amaz0n.com instead of amazon.com

🚩 **Suspicious links** — gooogle.com, paypa1.com

🚩 **A request to enter your password** — real companies never ask for your password`,
				},
			],
		})

		const task4_1 = await tx.task.create({
			data: {
				lessonId: lesson4_1.id,
				order: 1,
				type: TaskType.SINGLE_CHOICE,
				title: 'Recognizing Phishing',
				question: 'Which email is definitely phishing?',
				points: 10,
				difficulty: Difficulty.MEDIUM,
				correctAnswerIndex: 1,
				explanation:
					'Legitimate services NEVER urgently ask you to confirm your password via a link. This is a classic sign of phishing.',
			},
		})

		await tx.taskOption.createMany({
			data: [
				{
					taskId: task4_1.id,
					order: 1,
					text: 'A package delivery notice from a courier service',
					isCorrect: false,
				},
				{
					taskId: task4_1.id,
					order: 2,
					text: 'A demand to urgently confirm your password or your account will be deleted',
					isCorrect: true,
				},
				{
					taskId: task4_1.id,
					order: 3,
					text: 'A newsletter from a store',
					isCorrect: false,
				},
				{
					taskId: task4_1.id,
					order: 4,
					text: 'An order confirmation from a well-known site',
					isCorrect: false,
				},
			],
		})

		const task4_2 = await tx.task.create({
			data: {
				lessonId: lesson4_1.id,
				order: 2,
				type: TaskType.MULTI_CHOICE,
				title: 'Signs of Phishing',
				question: 'Select ALL signs of a phishing email:',
				points: 15,
				difficulty: Difficulty.MEDIUM,
				explanation:
					'Urgency, errors, and requests to enter your password are classic signs of phishing. A personal greeting can also appear in legitimate emails.',
			},
		})

		await tx.taskOption.createMany({
			data: [
				{
					taskId: task4_2.id,
					order: 1,
					text: 'Urgency and threats',
					isCorrect: true,
				},
				{
					taskId: task4_2.id,
					order: 2,
					text: 'Errors in the text',
					isCorrect: true,
				},
				{
					taskId: task4_2.id,
					order: 3,
					text: 'Personal greeting by name',
					isCorrect: false,
				},
				{
					taskId: task4_2.id,
					order: 4,
					text: 'A request to enter your password via a link',
					isCorrect: true,
				},
			],
		})

		const lesson4_2 = await tx.lesson.create({
			data: {
				title: 'Analyzing Phishing Emails',
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
					title: 'How to Check an Email',
					content: `**Step 1: Check the sender's address**
Hover over the sender's name. A real Amazon email comes from @amazon.com, not @amazonsupport.tk

**Step 2: Analyze links**
Hover over the link (don't click!). The real address appears at the bottom of your browser. If it says "Log in to PayPal" but the link goes to a strange domain — it's phishing.

**Step 3: Check the grammar**
Banks and large companies carefully proofread their text. Errors are a sign of scammers.

**Step 4: Think logically**
If you didn't order a package, why would you get a notification? If you never signed up on a site, why would it email you?`,
				},
				{
					lessonId: lesson4_2.id,
					order: 2,
					type: BlockType.THEORY,
					title: 'Phishing Examples',
					content: `**Example 1: A fake bank**
"Dear customer! Your card has been blocked. Follow this link and confirm your details"
❌ The bank addresses you as "customer," not by name
❌ Banks don't ask you to confirm details via a link

**Example 2: A tax office**
"You're entitled to a $500 tax refund. Enter your card details to receive the transfer"
❌ Tax offices don't request card details
❌ Refunds are processed through your personal account

**Example 3: A "security team"**
"Your account has been hacked! Urgently change your password via this link"
❌ Creating panic and urgency
❌ Passwords should only be changed on the official site`,
				},
			],
		})

		const task4_3 = await tx.task.create({
			data: {
				lessonId: lesson4_2.id,
				order: 1,
				type: TaskType.SINGLE_CHOICE,
				title: 'Checking Links',
				question: 'What is the correct way to check a link in an email?',
				points: 10,
				difficulty: Difficulty.MEDIUM,
				correctAnswerIndex: 1,
				explanation:
					"Hovering over a link shows the real URL at the bottom of your browser. There's no need to click it — that can be dangerous.",
			},
		})

		await tx.taskOption.createMany({
			data: [
				{
					taskId: task4_3.id,
					order: 1,
					text: 'Click the link and see where it goes',
					isCorrect: false,
				},
				{
					taskId: task4_3.id,
					order: 2,
					text: 'Hover over the link and check the URL at the bottom',
					isCorrect: true,
				},
				{
					taskId: task4_3.id,
					order: 3,
					text: 'Paste the link into Google',
					isCorrect: false,
				},
				{
					taskId: task4_3.id,
					order: 4,
					text: 'Ask your friends',
					isCorrect: false,
				},
			],
		})

		const course5 = await tx.course.create({
			data: {
				slug: 'social-engineering',
				title: 'Social Engineering',
				description: 'Psychological manipulation techniques',
				difficulty: Difficulty.HARD,
				stageId: stages[1].id,
			},
		})

		const lesson5_1 = await tx.lesson.create({
			data: {
				title: 'Social Engineering Methods',
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
					title: 'What Is Social Engineering?',
					content: `Social engineering is manipulating people to obtain confidential information or access to systems.

Hackers use psychology instead of technical methods:
- Trust
- Fear
- Greed
- Curiosity
- Authority

**Notable cases:**
- Kevin Mitnick hacked companies by calling employees and posing as IT support
- In 2016, hackers stole $81 million from the Central Bank of Bangladesh using social engineering`,
				},
				{
					lessonId: lesson5_1.id,
					order: 2,
					type: BlockType.THEORY,
					title: 'Manipulation Techniques',
					content: `**Pretexting** — inventing a fabricated situation
"I'm from the IT department, I urgently need to verify your password"

**Baiting** — offering something tempting
An infected USB drive labeled "2024 Salaries"

**Quid pro quo** — a favor for a favor
"I'll help you fix the problem, but I need your password"

**Tailgating** — physical intrusion
Someone carrying a box asks you to hold the office door open

**Authority** — impersonating a superior
"This is the director, transfer the money now!"`,
				},
			],
		})

		const task5_1 = await tx.task.create({
			data: {
				lessonId: lesson5_1.id,
				order: 1,
				type: TaskType.SINGLE_CHOICE,
				title: 'Social Engineering',
				question:
					'A call claiming to be from tech support asks you to read out a code from a text message. This is:',
				points: 15,
				difficulty: Difficulty.HARD,
				correctAnswerIndex: 1,
				explanation:
					'This is vishing (voice phishing) — a form of social engineering. Real tech support will never ask for a code from an SMS.',
			},
		})

		await tx.taskOption.createMany({
			data: [
				{
					taskId: task5_1.id,
					order: 1,
					text: 'A standard verification procedure',
					isCorrect: false,
				},
				{
					taskId: task5_1.id,
					order: 2,
					text: 'Social engineering (vishing)',
					isCorrect: true,
				},
				{
					taskId: task5_1.id,
					order: 3,
					text: 'A legitimate bank request',
					isCorrect: false,
				},
				{
					taskId: task5_1.id,
					order: 4,
					text: 'Technical support',
					isCorrect: false,
				},
			],
		})

		const course6 = await tx.course.create({
			data: {
				slug: 'phishing-practice',
				title: 'Practice: Recognizing Phishing',
				description: 'Real examples and exercises',
				difficulty: Difficulty.MEDIUM,
				stageId: stages[1].id,
			},
		})

		const lesson6_1 = await tx.lesson.create({
			data: {
				title: 'Breaking Down Real Cases',
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
				title: 'Case 1: A Fake Bank',
				content: `**Email received:**
Subject: "Urgent! Confirm your transaction"
From: security@yourbank-online.com

"Dear customer!
A suspicious transaction of $500 has been detected.
If this wasn't you, follow this link and cancel the transaction: http://your-bank.com.secure-check.com/cancel

You have 2 hours."

**Analysis:**
❌ Domain secure-check.com (not the actual bank)
❌ Creating panic and urgency
❌ The bank addresses you as "customer," not by name
✅ The correct domain would be something like yourbank.com or online.yourbank.com`,
			},
		})

		const task6_1 = await tx.task.create({
			data: {
				lessonId: lesson6_1.id,
				order: 1,
				type: TaskType.SINGLE_CHOICE,
				title: 'Analyzing Phishing',
				question: 'Which domain is definitely NOT phishing for a bank called "YourBank"?',
				points: 10,
				difficulty: Difficulty.MEDIUM,
				correctAnswerIndex: 1,
				explanation:
					"online.yourbank.com is the bank's official subdomain. The others use hyphens and unusual top-level domains.",
			},
		})

		await tx.taskOption.createMany({
			data: [
				{
					taskId: task6_1.id,
					order: 1,
					text: 'yourbank-secure.com',
					isCorrect: false,
				},
				{
					taskId: task6_1.id,
					order: 2,
					text: 'online.yourbank.com',
					isCorrect: true,
				},
				{
					taskId: task6_1.id,
					order: 3,
					text: 'your-bank.com',
					isCorrect: false,
				},
				{
					taskId: task6_1.id,
					order: 4,
					text: 'yourbank.online.com',
					isCorrect: false,
				},
			],
		})

		// ========================
		// STAGE 3: DANGEROUS LINKS
		// ========================
		const course7 = await tx.course.create({
			data: {
				slug: 'url-analysis',
				title: 'URL Analysis',
				description: 'Learning to check whether links are safe',
				difficulty: Difficulty.MEDIUM,
				stageId: stages[2].id,
			},
		})

		const lesson7_1 = await tx.lesson.create({
			data: {
				title: 'URL Structure',
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
					title: 'Anatomy of a URL',
					content: `A URL (Uniform Resource Locator) is the address of a resource on the internet.

**Structure:**
https://www.example.com:443/path/page?id=123#section

1. **Protocol:** https:// (secure) or http:// (insecure)
2. **Subdomain:** www
3. **Domain:** example.com (the main part!)
4. **Port:** :443 (usually hidden)
5. **Path:** /path/page
6. **Parameters:** ?id=123
7. **Anchor:** #section

**The most important part:** the domain. Everything else can be anything.`,
				},
				{
					lessonId: lesson7_1.id,
					order: 2,
					type: BlockType.THEORY,
					title: "Scammers' Tricks",
					content: `**Character substitution:**
- gооgle.com (a Cyrillic "о" instead of "o")
- paypa1.com (l → 1)
- αpple.com (α is a Greek letter)

**Decoy subdomains:**
- apple.com.fake-site.com (the real domain is fake-site.com!)
- secure-paypal.phishing.net

**Shortened links:**
- bit.ly/abc123 — you don't know where it leads
- Can hide malicious sites

**IP addresses:**
- http://192.168.1.1/login
- Legitimate sites use domains, not raw IPs`,
				},
			],
		})

		const task7_1 = await tx.task.create({
			data: {
				lessonId: lesson7_1.id,
				order: 1,
				type: TaskType.SINGLE_CHOICE,
				title: 'Identifying the Domain',
				question:
					'What is the real domain in this link: https://amazon.fake-store.com/products',
				points: 10,
				difficulty: Difficulty.MEDIUM,
				correctAnswerIndex: 1,
				explanation:
					'A domain is read right to left. fake-store.com is the real domain, while "amazon" is just a subdomain set up by scammers.',
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
				title: 'Link Checking Tools',
				description: 'Services for analyzing link safety',
				difficulty: Difficulty.MEDIUM,
				stageId: stages[2].id,
			},
		})

		const lesson8_1 = await tx.lesson.create({
			data: {
				title: 'VirusTotal and Other Services',
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
					content: `VirusTotal is a free Google service for checking files and links for viruses.

**How it works:**
1. Paste a link at virustotal.com
2. The service checks the URL against 90+ antivirus engines
3. Results appear within about 30 seconds

**What it checks:**
- Presence of malicious code
- Signs of phishing
- Domain reputation
- History of incidents

**Important:** don't paste in personal links — they become public!`,
				},
				{
					lessonId: lesson8_1.id,
					order: 2,
					type: BlockType.THEORY,
					title: 'Other Tools',
					content: `**URLScan.io** — analyzes a site's structure, screenshots, technologies used

**Google Safe Browsing** — built into Chrome, checks automatically

**PhishTank** — a community-driven database of phishing sites

**WHOIS** — information about a domain's owner and registration date

**Signs of a suspicious domain:**
- Registered recently (< 1 month ago)
- Private registration
- Hosted in countries with a poor reputation
- Multiple phishing reports`,
				},
			],
		})

		const task8_1 = await tx.task.create({
			data: {
				lessonId: lesson8_1.id,
				order: 1,
				type: TaskType.SINGLE_CHOICE,
				title: 'Checking Links',
				question:
					'Which service is NOT meant for checking link safety?',
				points: 10,
				difficulty: Difficulty.MEDIUM,
				correctAnswerIndex: 3,
				explanation:
					'Instagram is a social network, not a link safety checking tool.',
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
		// STAGE 4: PASSWORDS
		// ========================
		const course9 = await tx.course.create({
			data: {
				slug: 'strong-passwords',
				title: 'Creating Strong Passwords',
				description: 'How to come up with secure passwords',
				difficulty: Difficulty.EASY,
				stageId: stages[3].id,
			},
		})

		const lesson9_1 = await tx.lesson.create({
			data: {
				title: 'What Makes a Password Strong?',
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
					title: 'Criteria for a Strong Password',
					content: `**A strong password should:**
- Be at least 12 characters long
- Contain letters (A-Z, a-z), digits (0-9), and special characters (!@#$%)
- Not contain dictionary words
- Be unique for each site
- Not contain personal information (name, date of birth)

**Weak passwords:**
- password123
- qwerty
- 12345678
- johnsmith1990

**Strong passwords:**
- Tr3e$Blu3#Moon!2024
- P@ssw0rd_G3n3r@t3d!
- My$3cur3P@ss_2024`,
				},
				{
					lessonId: lesson9_1.id,
					order: 2,
					type: BlockType.THEORY,
					title: 'How Hackers Crack Passwords',
					content: `**Brute force** — trying every possible combination
- The password "12345" is cracked instantly
- An 8-character password takes a few hours
- A 16-character password takes millions of years

**Dictionary attack** — trying common words and combinations

**Credential stuffing** — using passwords from data breaches
If your password leaked from one site, hackers will try it everywhere

**Social engineering** — tricking you into revealing your password

**Statistics:**
- 81% of breaches are due to weak passwords
- "123456" is the most popular password in the world`,
				},
			],
		})

		const task9_1 = await tx.task.create({
			data: {
				lessonId: lesson9_1.id,
				order: 1,
				type: TaskType.SINGLE_CHOICE,
				title: 'Password Strength',
				question: 'Which password is the strongest?',
				points: 10,
				difficulty: Difficulty.EASY,
				correctAnswerIndex: 3,
				explanation:
					'The password xK8#mP2$vL9@rT4! mixes uppercase and lowercase letters, digits, and special characters — making it very strong.',
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
				title: 'Password Managers',
				description: 'Storing your passwords securely',
				difficulty: Difficulty.MEDIUM,
				stageId: stages[3].id,
			},
		})

		const lesson10_1 = await tx.lesson.create({
			data: {
				title: 'Why Use a Password Manager?',
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
					title: 'The Problem of Too Many Passwords',
					content: `The average user has 100+ online accounts. Remembering 100 unique passwords is impossible.

**Bad solutions:**
- Using one password everywhere (dangerous!)
- Writing them down on paper (can be lost)
- Storing them in a file on your computer (if hacked, everything is exposed)
- Using simple passwords (easy to crack)

**A good solution:** a password manager

This is software that:
- Generates complex, unique passwords
- Stores them encrypted
- Automatically fills them in on websites
- Syncs across your devices`,
				},
				{
					lessonId: lesson10_1.id,
					order: 2,
					type: BlockType.THEORY,
					title: 'Popular Password Managers',
					content: `**1Password** — $3/month, user-friendly interface

**Bitwarden** — free, open source

**LastPass** — popular, has a free tier

**Dashlane** — premium features, includes a VPN

**KeePass** — completely free, local storage

**Built-in options:**
- iCloud Keychain (Apple)
- Google Password Manager
- Firefox Lockwise

**How it works:**
1. You remember 1 master password
2. The manager generates the rest
3. You log in to sites automatically`,
				},
			],
		})

		const task10_1 = await tx.task.create({
			data: {
				lessonId: lesson10_1.id,
				order: 1,
				type: TaskType.SINGLE_CHOICE,
				title: 'Password Managers',
				question: "A password manager's main advantage is:",
				points: 10,
				difficulty: Difficulty.MEDIUM,
				correctAnswerIndex: 1,
				explanation:
					'A password manager generates and stores unique, complex passwords for every site — critical for security.',
			},
		})

		await tx.taskOption.createMany({
			data: [
				{
					taskId: task10_1.id,
					order: 1,
					text: 'Speeds up your computer',
					isCorrect: false,
				},
				{
					taskId: task10_1.id,
					order: 2,
					text: 'Lets you use unique passwords everywhere',
					isCorrect: true,
				},
				{
					taskId: task10_1.id,
					order: 3,
					text: 'Protects against viruses',
					isCorrect: false,
				},
				{
					taskId: task10_1.id,
					order: 4,
					text: 'Increases internet speed',
					isCorrect: false,
				},
			],
		})

		const course11 = await tx.course.create({
			data: {
				slug: 'two-factor-auth',
				title: 'Two-Factor Authentication',
				description: 'An extra layer of protection',
				difficulty: Difficulty.MEDIUM,
				stageId: stages[3].id,
			},
		})

		const lesson11_1 = await tx.lesson.create({
			data: {
				title: 'What Is 2FA?',
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
					title: '2FA — Double Protection',
					content: `2FA (Two-Factor Authentication) means logging in requires two confirmations:
1. Something you know (a password)
2. Something you have (a phone, a security key)

**Why this matters:**
Even if a hacker learns your password, they can't log in without the second factor.

**Examples:**
- Banking apps + an SMS code
- Email + a code from an app
- Social media + biometrics

**Statistics:** 2FA blocks 99.9% of automated attacks`,
				},
				{
					lessonId: lesson11_1.id,
					order: 2,
					type: BlockType.THEORY,
					title: 'Types of 2FA',
					content: `**SMS codes** — the simplest, but the least secure (vulnerable to SIM-swap attacks)

**Authenticator apps** — generate codes offline (Google Authenticator, Authy)

**Push notifications** — confirm on your phone (convenient)

**Hardware keys** — physical devices (YubiKey, the most secure)

**Biometrics** — fingerprint, Face ID

**Recommended order of security:**
1. Hardware key (YubiKey)
2. Authenticator app
3. Push notification
4. SMS (better than nothing)`,
				},
			],
		})

		const task11_1 = await tx.task.create({
			data: {
				lessonId: lesson11_1.id,
				order: 1,
				type: TaskType.SINGLE_CHOICE,
				title: '2FA Methods',
				question: 'Which 2FA method is the most secure?',
				points: 10,
				difficulty: Difficulty.MEDIUM,
				correctAnswerIndex: 0,
				explanation:
					'Hardware keys (YubiKey) are the most reliable 2FA method since they resist phishing and cannot be intercepted.',
			},
		})

		await tx.taskOption.createMany({
			data: [
				{
					taskId: task11_1.id,
					order: 1,
					text: 'Hardware key (YubiKey)',
					isCorrect: true,
				},
				{ taskId: task11_1.id, order: 2, text: 'SMS code', isCorrect: false },
				{
					taskId: task11_1.id,
					order: 3,
					text: 'Email with a code',
					isCorrect: false,
				},
				{
					taskId: task11_1.id,
					order: 4,
					text: 'A secret question',
					isCorrect: false,
				},
			],
		})

		// ========================
		// STAGE 5: MALWARE
		// ========================
		const course12 = await tx.course.create({
			data: {
				slug: 'malware-types',
				title: 'Types of Malware',
				description: 'Viruses, trojans, ransomware',
				difficulty: Difficulty.MEDIUM,
				stageId: stages[4].id,
			},
		})

		const lesson12_1 = await tx.lesson.create({
			data: {
				title: 'Classifying Malware',
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
					title: 'Main Types',
					content: `**Viruses** — infect files, spread when files are copied

**Worms** — spread by themselves across a network, without user involvement

**Trojans** — disguise themselves as useful software, perform hidden actions

**Ransomware** — encrypts files and demands a ransom

**Spyware** — tracks user activity, steals data

**Adware** — displays intrusive ads

**Rootkit** — hides the presence of malware on a system`,
				},
				{
					lessonId: lesson12_1.id,
					order: 2,
					type: BlockType.THEORY,
					title: 'Notable Attacks',
					content: `**WannaCry (2017)** — ransomware that encrypted 200,000+ computers, demanding $300 in bitcoin

**NotPetya (2017)** — a worm that caused $10 billion in damage, paralyzing companies worldwide

**Zeus** — a trojan for stealing banking data, stole millions

**Stuxnet** — cyberweapon that sabotaged Iranian nuclear facilities

**Emotet** — a botnet used to distribute spam and malware`,
				},
			],
		})

		const task12_1 = await tx.task.create({
			data: {
				lessonId: lesson12_1.id,
				order: 1,
				type: TaskType.SINGLE_CHOICE,
				title: 'Types of Malware',
				question: 'Which type of malware encrypts files and demands a ransom?',
				points: 10,
				difficulty: Difficulty.MEDIUM,
				correctAnswerIndex: 2,
				explanation:
					'Ransomware blocks access to files and demands a ransom, usually in cryptocurrency.',
			},
		})

		await tx.taskOption.createMany({
			data: [
				{ taskId: task12_1.id, order: 1, text: 'Virus', isCorrect: false },
				{ taskId: task12_1.id, order: 2, text: 'Spyware', isCorrect: false },
				{ taskId: task12_1.id, order: 3, text: 'Ransomware', isCorrect: true },
				{ taskId: task12_1.id, order: 4, text: 'Adware', isCorrect: false },
			],
		})

		const course13 = await tx.course.create({
			data: {
				slug: 'malware-protection',
				title: 'Protection Against Malware',
				description: 'Prevention and removal',
				difficulty: Difficulty.MEDIUM,
				stageId: stages[4].id,
			},
		})

		const lesson13_1 = await tx.lesson.create({
			data: {
				title: 'How to Protect Yourself From Malware',
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
					title: 'Preventing Infection',
					content: `**1. Antivirus** — install reliable antivirus software with real-time protection

**2. Updates** — always install system and app updates

**3. Be careful when downloading:**
- Only download from official sites
- Check files with VirusTotal
- Don't run .exe files from emails

**4. Don't open suspicious attachments** in email

**5. Backups** — back up your important files

**6. Ad blocker** — protects against malvertising`,
				},
				{
					lessonId: lesson13_1.id,
					order: 2,
					type: BlockType.THEORY,
					title: 'Signs of Infection',
					content: `**Your computer may be infected if:**
- It runs slowly for no reason
- Strange programs appear
- Your browser opens unfamiliar sites
- Your antivirus turns off by itself
- Files are missing or encrypted
- You see lots of ads even outside your browser
- High CPU usage while idle

**What to do:**
1. Disconnect from the internet
2. Run a full antivirus scan
3. Use Malwarebytes or Dr.Web CureIt
4. As a last resort — reinstall the operating system`,
				},
			],
		})

		const task13_1 = await tx.task.create({
			data: {
				lessonId: lesson13_1.id,
				order: 1,
				type: TaskType.MULTI_CHOICE,
				title: 'Protection Against Malware',
				question: 'Which actions protect against malware? (multiple):',
				points: 15,
				difficulty: Difficulty.MEDIUM,
				explanation:
					'Antivirus, updates, and backups are the three pillars of malware protection. Disabling Defender is dangerous.',
			},
		})

		await tx.taskOption.createMany({
			data: [
				{
					taskId: task13_1.id,
					order: 1,
					text: 'Installing antivirus software',
					isCorrect: true,
				},
				{
					taskId: task13_1.id,
					order: 2,
					text: 'Regular system updates',
					isCorrect: true,
				},
				{
					taskId: task13_1.id,
					order: 3,
					text: 'Disabling Windows Defender for speed',
					isCorrect: false,
				},
				{
					taskId: task13_1.id,
					order: 4,
					text: 'Backing up files',
					isCorrect: true,
				},
			],
		})

		// ========================
		// STAGE 6: SOCIAL MEDIA
		// ========================
		const course14 = await tx.course.create({
			data: {
				slug: 'social-media-privacy',
				title: 'Social Media Privacy',
				description: 'Configuring account security',
				difficulty: Difficulty.EASY,
				stageId: stages[5].id,
			},
		})

		const lesson14_1 = await tx.lesson.create({
			data: {
				title: 'Privacy Settings',
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
					title: 'Why Privacy Matters',
					content: `Your social media posts can be seen by:
- Employers during hiring
- Scammers gathering data
- Marketers for targeting
- Random strangers

**What they can learn:**
- Where you live (from geotags)
- When you're not home (vacation posts)
- Where you work and study
- Your social circle
- Your habits and interests

**Consequences:**
- Being hacked via social engineering
- Identity theft
- Cyberbullying
- Stalking`,
				},
				{
					lessonId: lesson14_1.id,
					order: 2,
					type: BlockType.THEORY,
					title: 'How to Configure Privacy',
					content: `**Basic settings:**

**Instagram:**
Settings → Privacy → Private Account

**Facebook:**
Settings → Privacy → Who can see my posts → Friends

**Telegram:**
Settings → Privacy → Phone Number/Photo → Nobody

**TikTok:**
Settings → Privacy → Private Account

**Recommendations:**
- Turn off geolocation
- Hide your friends list
- Review old posts
- Don't add strangers`,
				},
			],
		})

		const task14_1 = await tx.task.create({
			data: {
				lessonId: lesson14_1.id,
				order: 1,
				type: TaskType.SINGLE_CHOICE,
				title: 'Social Media Privacy',
				question: 'What is safer to post on a public profile?',
				points: 10,
				difficulty: Difficulty.EASY,
				correctAnswerIndex: 2,
				explanation:
					'A meme without geotags is relatively safe. Documents, your address, and tickets with reference numbers can be used by scammers.',
			},
		})

		await tx.taskOption.createMany({
			data: [
				{
					taskId: task14_1.id,
					order: 1,
					text: 'Your passport number',
					isCorrect: false,
				},
				{
					taskId: task14_1.id,
					order: 2,
					text: 'Your home address',
					isCorrect: false,
				},
				{
					taskId: task14_1.id,
					order: 3,
					text: 'A meme photo without geotags',
					isCorrect: true,
				},
				{
					taskId: task14_1.id,
					order: 4,
					text: 'A photo of plane tickets with the booking number',
					isCorrect: false,
				},
			],
		})

		const course15 = await tx.course.create({
			data: {
				slug: 'social-media-scams',
				title: 'Social Media Scams',
				description: 'Recognizing deception',
				difficulty: Difficulty.MEDIUM,
				stageId: stages[5].id,
			},
		})

		const lesson15_1 = await tx.lesson.create({
			data: {
				title: 'Types of Scams',
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
				title: 'Common Schemes',
				content: `**1. A hacked friend's account:** "Hey! I urgently need money, send it to my card"

**2. Fake giveaways:** "Share and win an iPhone!" (a scheme to collect followers)

**3. Fake charity fundraisers**

**4. Phishing via direct messages:** "Click this link, you won!"

**5. Prepaid job offers:** "Work from home, but first pay for training"

**6. Investment pyramids:** "Invest $100, get $1,000 back!"

**How to check:**
- Call your friend directly to verify
- Check the profile's authenticity
- Don't click suspicious links
- Don't send money to strangers`,
			},
		})

		const task15_1 = await tx.task.create({
			data: {
				lessonId: lesson15_1.id,
				order: 1,
				type: TaskType.SINGLE_CHOICE,
				title: 'Social Media Scams',
				question: 'A friend messages "Urgently send me $50". What should you do?',
				points: 10,
				difficulty: Difficulty.MEDIUM,
				correctAnswerIndex: 1,
				explanation:
					"Your friend's account may have been hacked. Always call them directly to verify such requests.",
			},
		})

		await tx.taskOption.createMany({
			data: [
				{
					taskId: task15_1.id,
					order: 1,
					text: 'Send the money right away',
					isCorrect: false,
				},
				{
					taskId: task15_1.id,
					order: 2,
					text: 'Call your friend to confirm',
					isCorrect: true,
				},
				{
					taskId: task15_1.id,
					order: 3,
					text: 'Ask for their card number in the chat',
					isCorrect: false,
				},
				{
					taskId: task15_1.id,
					order: 4,
					text: 'Ask them to call you',
					isCorrect: false,
				},
			],
		})

		// ========================
		// STAGE 7: PERSONAL DATA
		// ========================
		const course16 = await tx.course.create({
			data: {
				slug: 'personal-data',
				title: 'Protecting Personal Data',
				description: "What you shouldn't post",
				difficulty: Difficulty.EASY,
				stageId: stages[6].id,
			},
		})

		const lesson16_1 = await tx.lesson.create({
			data: {
				title: 'What Data to Protect',
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
					title: 'Critical Data',
					content: `**NEVER post:**
- Your passport/ID number
- Bank card details (full number, CVV, PIN)
- Passwords
- Phone number (except for business purposes)
- Home address
- Your home's geolocation
- Photos of documents

**Be cautious with:**
- Date of birth (used for password recovery)
- Full legal name
- Email
- Workplace/school
- Routes and schedule`,
				},
				{
					lessonId: lesson16_1.id,
					order: 2,
					type: BlockType.THEORY,
					title: 'What Can Be Done With Your Data',
					content: `**With your full name + date of birth + phone number:**
- Take out a loan in your name
- Register accounts
- Recover access to your social media
- Call and trick you out of money posing as your bank

**With a scan of your ID:**
- Take out a loan
- Register a company
- Buy a SIM card
- Commit a crime under your identity

**Protection:**
- Don't send ID scans to strangers
- Add a watermark to documents you share
- Check your credit history once a year
- Don't post tickets with barcodes`,
				},
			],
		})

		const task16_1 = await tx.task.create({
			data: {
				lessonId: lesson16_1.id,
				order: 1,
				type: TaskType.MULTI_CHOICE,
				title: 'Data Protection',
				question: 'Which data is DANGEROUS to post? (multiple):',
				points: 15,
				difficulty: Difficulty.EASY,
				explanation:
					'ID numbers, addresses, and CVV codes are critical data that can be used for fraud and identity theft.',
			},
		})

		await tx.taskOption.createMany({
			data: [
				{
					taskId: task16_1.id,
					order: 1,
					text: 'Your passport/ID number',
					isCorrect: true,
				},
				{
					taskId: task16_1.id,
					order: 2,
					text: 'Your home address',
					isCorrect: true,
				},
				{
					taskId: task16_1.id,
					order: 3,
					text: 'Your favorite book',
					isCorrect: false,
				},
				{
					taskId: task16_1.id,
					order: 4,
					text: 'Your bank card CVV code',
					isCorrect: true,
				},
			],
		})

		const course17 = await tx.course.create({
			data: {
				slug: 'data-leaks',
				title: 'Data Breaches',
				description: 'How to check and what to do',
				difficulty: Difficulty.MEDIUM,
				stageId: stages[6].id,
			},
		})

		const lesson17_1 = await tx.lesson.create({
			data: {
				title: 'Checking for Breaches',
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
					title: 'What Is a Data Breach',
					content: `A data breach is when hackers break into a service and leak its user database.

**Biggest breaches:**
- Yahoo (2013) — 3 billion accounts
- Facebook (2019) — 533 million users
- LinkedIn (2021) — 700 million profiles
- Twitter/X (2023) — 200+ million accounts

**What ends up in breaches:**
- Email + password
- Phone number
- First and last name
- Date of birth
- Address
- Purchase history`,
				},
				{
					lessonId: lesson17_1.id,
					order: 2,
					type: BlockType.THEORY,
					title: 'How to Check Your Data',
					content: `**HaveIBeenPwned.com** — enter your email to find out about breaches

**LeakCheck.io** — checks by email, phone, or username (partially paid)

**Firefox Monitor** — a free breach-checking service by Mozilla

**What to do if you find a breach:**
1. Immediately change your password on that site
2. Change your password everywhere else you reused it
3. Turn on 2FA
4. Check your active sessions
5. Watch your bank account

**Prevention:**
- Use unique passwords everywhere
- Don't ignore notifications about suspicious logins`,
				},
			],
		})

		const task17_1 = await tx.task.create({
			data: {
				lessonId: lesson17_1.id,
				order: 1,
				type: TaskType.SINGLE_CHOICE,
				title: 'Data Breaches',
				question: 'You find out your password leaked in a data breach. What should you do first?',
				points: 10,
				difficulty: Difficulty.MEDIUM,
				correctAnswerIndex: 1,
				explanation:
					"If a password leaks, it needs to be changed immediately before hackers can log into your account.",
			},
		})

		await tx.taskOption.createMany({
			data: [
				{
					taskId: task17_1.id,
					order: 1,
					text: 'Nothing, let them try to hack it',
					isCorrect: false,
				},
				{
					taskId: task17_1.id,
					order: 2,
					text: 'Change your password immediately',
					isCorrect: true,
				},
				{
					taskId: task17_1.id,
					order: 3,
					text: 'Delete the account',
					isCorrect: false,
				},
				{
					taskId: task17_1.id,
					order: 4,
					text: 'Wait a week',
					isCorrect: false,
				},
			],
		})

		const course18 = await tx.course.create({
			data: {
				slug: 'vpn-encryption',
				title: 'VPN and Encryption',
				description: 'Anonymity and traffic protection',
				difficulty: Difficulty.HARD,
				stageId: stages[6].id,
			},
		})

		const lesson18_1 = await tx.lesson.create({
			data: {
				title: 'VPN Basics',
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
					title: 'What Is a VPN',
					content: `A VPN (Virtual Private Network) encrypts your traffic and hides your IP address.

**How it works:**
1. You turn on the VPN
2. All your traffic goes through an encrypted tunnel to a VPN server
3. Websites see you connecting from the VPN server's IP
4. Your ISP only sees the VPN connection, not the sites you visit

**Why you'd need one:**
- Bypassing blocks
- Protection on public Wi-Fi
- Hiding your activity from your ISP
- Accessing region-locked content`,
				},
				{
					lessonId: lesson18_1.id,
					order: 2,
					type: BlockType.THEORY,
					title: 'Choosing a VPN',
					content: `**Paid (reliable):**
- NordVPN
- ExpressVPN
- ProtonVPN
- Mullvad

**Free (with limitations):**
- ProtonVPN Free
- Windscribe (10 GB/month)

**DON'T use:**
- VPNs bundled with suspicious apps
- Random free VPNs with no reputation
- VPNs with poor reviews

**Selection criteria:**
- A no-logs policy (they don't keep logs)
- Connection speed
- Number of servers
- Device support
- Price`,
				},
			],
		})

		const task18_1 = await tx.task.create({
			data: {
				lessonId: lesson18_1.id,
				order: 1,
				type: TaskType.SINGLE_CHOICE,
				title: 'VPN',
				question: "A VPN's main purpose is to:",
				points: 15,
				difficulty: Difficulty.HARD,
				correctAnswerIndex: 1,
				explanation:
					'A VPN encrypts all your internet traffic and hides your IP address, protecting against surveillance and data interception.',
			},
		})

		await tx.taskOption.createMany({
			data: [
				{
					taskId: task18_1.id,
					order: 1,
					text: 'Speed up the internet',
					isCorrect: false,
				},
				{
					taskId: task18_1.id,
					order: 2,
					text: 'Encrypt traffic and hide your IP',
					isCorrect: true,
				},
				{
					taskId: task18_1.id,
					order: 3,
					text: 'Block ads',
					isCorrect: false,
				},
				{
					taskId: task18_1.id,
					order: 4,
					text: 'Increase download speed',
					isCorrect: false,
				},
			],
		})

		// ========================
		// STAGE 8: ADVANCED
		// ========================
		const course19 = await tx.course.create({
			data: {
				slug: 'advanced-threats',
				title: 'Advanced Threats',
				description: 'APT, zero-day exploits, cryptojacking',
				difficulty: Difficulty.HARD,
				stageId: stages[7].id,
			},
		})

		const lesson19_1 = await tx.lesson.create({
			data: {
				title: 'APT Attacks',
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
				content: `An APT (Advanced Persistent Threat) is a targeted, long-term cyberattack against a major organization.

**Characteristics:**
- State-sponsored
- Exploit zero-day vulnerabilities
- Go undetected for months
- Steal strategic information

**Known groups:**
- APT28 (Fancy Bear)
- APT29 (Cozy Bear)
- APT1
- Lazarus Group

**Examples:**
- Stuxnet — sabotage of Iranian centrifuges
- SolarWinds (2020) — a breach via a compromised software update

**Protection:** the average person isn't a target — these attacks target governments and corporations`,
			},
		})

		const task19_1 = await tx.task.create({
			data: {
				lessonId: lesson19_1.id,
				order: 1,
				type: TaskType.SINGLE_CHOICE,
				title: 'APT Attacks',
				question: 'What is characteristic of APT attacks?',
				points: 20,
				difficulty: Difficulty.HARD,
				correctAnswerIndex: 2,
				explanation:
					'APTs (Advanced Persistent Threats) are sophisticated, long-term attacks that can go undetected for months.',
			},
		})

		await tx.taskOption.createMany({
			data: [
				{
					taskId: task19_1.id,
					order: 1,
					text: 'Mass spam distribution',
					isCorrect: false,
				},
				{
					taskId: task19_1.id,
					order: 2,
					text: 'A quick hack lasting a few hours',
					isCorrect: false,
				},
				{
					taskId: task19_1.id,
					order: 3,
					text: 'Long-term, hidden infiltration of a network',
					isCorrect: true,
				},
				{
					taskId: task19_1.id,
					order: 4,
					text: 'Displaying ads',
					isCorrect: false,
				},
			],
		})

		const course20 = await tx.course.create({
			data: {
				slug: 'incident-response',
				title: 'Incident Response',
				description: 'What to do after being hacked',
				difficulty: Difficulty.HARD,
				stageId: stages[7].id,
			},
		})

		const lesson20_1 = await tx.lesson.create({
			data: {
				title: 'An Action Plan After Being Hacked',
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
					title: 'Signs of a Hack',
					content: `**Your account was hacked if:**
- Posts appear that you didn't make
- Your password changed
- You get a "Your password was changed" email you didn't request
- Active sessions show up from other cities
- Friends receive spam from you

**Your computer was hacked if:**
- Files are encrypted (ransomware)
- Unfamiliar programs are set to run at startup
- Your webcam turns on by itself
- Money disappeared from your account
- High network traffic for no reason`,
				},
				{
					lessonId: lesson20_1.id,
					order: 2,
					type: BlockType.THEORY,
					title: 'What to Do Immediately',
					content: `**Step 1:** Disconnect the device from the internet

**Step 2:** Change your passwords from a different device

**Step 3:** End all active sessions

**Step 4:** Enable 2FA

**Step 5:** Scan your computer with antivirus software

**Step 6:** Notify friends if your account sent them spam

**Step 7:** If money was stolen — freeze your card and contact your bank

**Step 8:** Save evidence (screenshots)

**Step 9:** Contact the service's support team

**Step 10:** File a police report (if money was stolen)`,
				},
			],
		})

		const task20_1 = await tx.task.create({
			data: {
				lessonId: lesson20_1.id,
				order: 1,
				type: TaskType.SINGLE_CHOICE,
				title: 'What to Do After a Hack',
				question: 'What should you do FIRST if your account is hacked?',
				points: 15,
				difficulty: Difficulty.HARD,
				correctAnswerIndex: 1,
				explanation:
					'First, isolate the device from the network and change your password from a clean device to prevent further damage.',
			},
		})

		await tx.taskOption.createMany({
			data: [
				{
					taskId: task20_1.id,
					order: 1,
					text: 'Message support',
					isCorrect: false,
				},
				{
					taskId: task20_1.id,
					order: 2,
					text: 'Disconnect from the internet and change your password from another device',
					isCorrect: true,
				},
				{
					taskId: task20_1.id,
					order: 3,
					text: 'Delete the account',
					isCorrect: false,
				},
				{
					taskId: task20_1.id,
					order: 4,
					text: 'Wait a few days',
					isCorrect: false,
				},
			],
		})

		// ========================
		// ACHIEVEMENTS
		// ========================
		console.log('🏆 Creating achievements...')
		await tx.achievement.createMany({
			data: [
				{
					code: 'FIRST_LOGIN',
					title: 'First Login',
					description: 'Registered in the system',
					icon: 'log-in',
				},
				{
					code: 'FIRST_LESSON',
					title: 'First Lesson',
					description: 'Completed your first lesson',
					icon: 'book-open',
				},
				{
					code: 'PHISHING_MASTER',
					title: 'Phishing Master',
					description: 'Completed the phishing course',
					icon: 'fish',
				},
				{
					code: 'PASSWORD_EXPERT',
					title: 'Password Expert',
					description: 'Completed all password courses',
					icon: 'key',
				},
				{
					code: 'SECURITY_NOVICE',
					title: 'Security Novice',
					description: 'Completed the first learning stage',
					icon: 'shield',
				},
				{
					code: 'SECURITY_ADVANCED',
					title: 'Advanced User',
					description: 'Completed 4 learning stages',
					icon: 'award',
				},
				{
					code: 'SECURITY_EXPERT',
					title: 'Security Expert',
					description: 'Completed all 8 stages',
					icon: 'trophy',
				},
				{
					code: 'PERFECT_SCORE',
					title: 'Perfect Score',
					description: 'Solved 50 tasks in a row without a mistake',
					icon: 'star',
				},
				{
					code: 'FAST_LEARNER',
					title: 'Fast Learner',
					description: 'Completed a course in 1 day',
					icon: 'zap',
				},
				{
					code: 'CERTIFIED',
					title: 'Certified',
					description: 'Earned your first certificate',
					icon: 'file-badge',
				},
			],
		})

		// ========================
		// TESTS
		// ========================
		console.log('📝 Creating tests...')

		const test1 = await tx.test.create({
			data: {
				title: 'Final Test: Security Basics',
				description: 'Testing your knowledge of digital safety basics',
				courseId: course1.id,
				passingScore: 70,
			},
		})

		const tq1_1 = await tx.testQuestion.create({
			data: {
				testId: test1.id,
				order: 1,
				text: "What is antivirus software's main function?",
				type: TaskType.SINGLE_CHOICE,
				correctAnswerIndex: 1,
			},
		})

		await tx.testQuestionOption.createMany({
			data: [
				{
					testQuestionId: tq1_1.id,
					order: 1,
					text: 'Speeding up the computer',
					isCorrect: false,
				},
				{
					testQuestionId: tq1_1.id,
					order: 2,
					text: 'Protection against malware',
					isCorrect: true,
				},
				{
					testQuestionId: tq1_1.id,
					order: 3,
					text: 'Increasing internet speed',
					isCorrect: false,
				},
			],
		})

		const tq1_2 = await tx.testQuestion.create({
			data: {
				testId: test1.id,
				order: 2,
				text: 'How do you identify a secure connection?',
				type: TaskType.SINGLE_CHOICE,
				correctAnswerIndex: 0,
			},
		})

		await tx.testQuestionOption.createMany({
			data: [
				{
					testQuestionId: tq1_2.id,
					order: 1,
					text: 'A lock icon and https:// in the address bar',
					isCorrect: true,
				},
				{
					testQuestionId: tq1_2.id,
					order: 2,
					text: 'A nice-looking website design',
					isCorrect: false,
				},
				{
					testQuestionId: tq1_2.id,
					order: 3,
					text: 'A page that loads quickly',
					isCorrect: false,
				},
			],
		})

		const test2 = await tx.test.create({
			data: {
				title: 'Final Test: Phishing',
				description: 'Testing your phishing recognition skills',
				courseId: course4.id,
				passingScore: 80,
			},
		})

		const tq2_1 = await tx.testQuestion.create({
			data: {
				testId: test2.id,
				order: 1,
				text: 'Which sign definitely indicates a phishing email?',
				type: TaskType.SINGLE_CHOICE,
				correctAnswerIndex: 2,
			},
		})

		await tx.testQuestionOption.createMany({
			data: [
				{
					testQuestionId: tq2_1.id,
					order: 1,
					text: 'An email from a friend',
					isCorrect: false,
				},
				{
					testQuestionId: tq2_1.id,
					order: 2,
					text: 'A personal greeting',
					isCorrect: false,
				},
				{
					testQuestionId: tq2_1.id,
					order: 3,
					text: 'An urgent demand to enter your password via a link',
					isCorrect: true,
				},
			],
		})

		const tq2_2 = await tx.testQuestion.create({
			data: {
				testId: test2.id,
				order: 2,
				text: 'What is the correct way to check a link in an email?',
				type: TaskType.SINGLE_CHOICE,
				correctAnswerIndex: 1,
			},
		})

		await tx.testQuestionOption.createMany({
			data: [
				{
					testQuestionId: tq2_2.id,
					order: 1,
					text: 'Click it right away',
					isCorrect: false,
				},
				{
					testQuestionId: tq2_2.id,
					order: 2,
					text: 'Hover over it and check the URL',
					isCorrect: true,
				},
				{
					testQuestionId: tq2_2.id,
					order: 3,
					text: 'Paste it into Google',
					isCorrect: false,
				},
			],
		})

		const test3 = await tx.test.create({
			data: {
				title: 'Final Test: Passwords',
				description: 'Testing your knowledge of password security',
				courseId: course9.id,
				passingScore: 75,
			},
		})

		const tq3_1 = await tx.testQuestion.create({
			data: {
				testId: test3.id,
				order: 1,
				text: 'Which password is the strongest?',
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
				text: 'Which 2FA method is the most secure?',
				type: TaskType.SINGLE_CHOICE,
				correctAnswerIndex: 0,
			},
		})

		await tx.testQuestionOption.createMany({
			data: [
				{
					testQuestionId: tq3_2.id,
					order: 1,
					text: 'Hardware key',
					isCorrect: true,
				},
				{
					testQuestionId: tq3_2.id,
					order: 2,
					text: 'SMS code',
					isCorrect: false,
				},
				{
					testQuestionId: tq3_2.id,
					order: 3,
					text: 'Email with a code',
					isCorrect: false,
				},
			],
		})

		const test4 = await tx.test.create({
			data: {
				title: 'Final Test: Malware',
				description: 'Testing your knowledge of malware',
				courseId: course12.id,
				passingScore: 80,
			},
		})

		const tq4_1 = await tx.testQuestion.create({
			data: {
				testId: test4.id,
				order: 1,
				text: 'Which type of malware encrypts files and demands a ransom?',
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
				title: 'Final Test: Data Protection',
				description: 'Testing your knowledge of privacy',
				courseId: course16.id,
				passingScore: 75,
			},
		})

		const tq5_1 = await tx.testQuestion.create({
			data: {
				testId: test5.id,
				order: 1,
				text: 'What is DANGEROUS to post on social media?',
				type: TaskType.SINGLE_CHOICE,
				correctAnswerIndex: 1,
			},
		})

		await tx.testQuestionOption.createMany({
			data: [
				{
					testQuestionId: tq5_1.id,
					order: 1,
					text: 'A meme photo',
					isCorrect: false,
				},
				{
					testQuestionId: tq5_1.id,
					order: 2,
					text: 'Your passport/ID number',
					isCorrect: true,
				},
				{
					testQuestionId: tq5_1.id,
					order: 3,
					text: 'Your favorite book',
					isCorrect: false,
				},
			],
		})

		// ========================
		// DEMO PROGRESS
		// ========================
		console.log('📊 Creating demo progress for user...')

		// Course progress
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

		// Completed lessons
		await tx.completedLesson.createMany({
			data: [
				{ userId: demoUser.id, lessonId: lesson1_1.id },
				{ userId: demoUser.id, lessonId: lesson1_2.id },
				{ userId: demoUser.id, lessonId: lesson4_1.id },
			],
		})

		// Task attempts
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

		// Test results
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

		// Awarded achievements
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

		// Issue a certificate for the first course
		await tx.certificate.create({
			data: {
				userId: demoUser.id,
				courseId: course1.id,
				certificateNumber: `CERT-${new Date().getFullYear()}1230-00001`,
			},
		})

		console.log('✅ SEED COMPLETED!')
		console.log('\n📊 FINAL STATISTICS:')
		console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
		console.log('👥 Users: 2')
		console.log('   ├─ demo@safe.net (with progress)')
		console.log('   └─ admin@safe.net')
		console.log('')
		console.log('📚 Learning structure:')
		console.log('   ├─ Stages: 8')
		console.log('   ├─ Courses: 20')
		console.log('   ├─ Lessons: 20')
		console.log('   ├─ Theory blocks: 40+')
		console.log('   ├─ Practice tasks: 20+')
		console.log('   └─ Tests: 5')
		console.log('')
		console.log('🎯 Stages:')
		console.log('   1️⃣  Security Basics (3 courses)')
		console.log('   2️⃣  Phishing & Fraud (3 courses)')
		console.log('   3️⃣  Dangerous Links (2 courses)')
		console.log('   4️⃣  Passwords (3 courses)')
		console.log('   5️⃣  Malware (2 courses)')
		console.log('   6️⃣  Social Media (2 courses)')
		console.log('   7️⃣  Personal Data (3 courses)')
		console.log('   8️⃣  Advanced Level (2 courses)')
		console.log('')
		console.log('🏆 Achievements: 10')
		console.log('📜 Demo certificate: 1')
		console.log('')
		console.log('📊 Demo progress:')
		console.log('   ├─ Security Basics: 100% ✅')
		console.log('   ├─ Safe Browsing: 50%')
		console.log('   ├─ Introduction to Phishing: 75%')
		console.log('   └─ Strong Passwords: 30%')
		console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
		console.log('\n🎉 Database is ready to use!')
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
