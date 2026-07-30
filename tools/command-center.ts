#!/usr/bin/env bun

type CategoryId = 'run' | 'build' | 'check' | 'system'

type Command = {
	label: string
	script: string
	description: string
	meta: string
}

type Category = {
	id: CategoryId
	label: string
	accent: [number, number, number]
	commands: Command[]
}

const categories: Category[] = [
	{
		id: 'run',
		label: 'RUN',
		accent: [74, 211, 238],
		commands: [
			{
				label: 'Development stack',
				script: 'dev',
				description: 'Start PostgreSQL, API, web app, and the optional ML service.',
				meta: 'api · web · ml',
			},
			{
				label: 'Core stack',
				script: 'dev:no-ml',
				description: 'Start PostgreSQL, API, and web app without the Python model.',
				meta: 'api · web',
			},
			{
				label: 'API only',
				script: 'dev:api',
				description: 'Run the NestJS API in watch mode.',
				meta: 'localhost:4200',
			},
			{
				label: 'Web only',
				script: 'dev:web',
				description: 'Run the Next.js development server.',
				meta: 'localhost:3000',
			},
			{
				label: 'Extension only',
				script: 'dev:ext',
				description: 'Run WXT with browser-extension hot reload.',
				meta: 'chrome · mv3',
			},
		],
	},
	{
		id: 'build',
		label: 'BUILD',
		accent: [167, 139, 250],
		commands: [
			{
				label: 'Everything',
				script: 'build',
				description: 'Build API, web app, and extension together.',
				meta: 'production',
			},
			{
				label: 'API',
				script: 'build:api',
				description: 'Compile the NestJS API.',
				meta: 'server/dist',
			},
			{
				label: 'Web',
				script: 'build:web',
				description: 'Create the optimized Next.js production build.',
				meta: 'client/.next',
			},
			{
				label: 'Extension',
				script: 'build:ext',
				description: 'Build the Chrome MV3 extension with WXT.',
				meta: 'extension/.output',
			},
			{
				label: 'Package extension',
				script: 'package:ext',
				description: 'Create the Chrome zip and copy it to web downloads.',
				meta: 'zip · chrome',
			},
		],
	},
	{
		id: 'check',
		label: 'CHECK',
		accent: [52, 211, 153],
		commands: [
			{
				label: 'Fast check',
				script: 'check',
				description: 'Run type checks, web lint, and localization contracts.',
				meta: 'recommended',
			},
			{
				label: 'Full verification',
				script: 'verify',
				description: 'Run checks, tests, and every production build.',
				meta: 'release gate',
			},
			{
				label: 'Type checks',
				script: 'typecheck',
				description: 'Check API, web, extension, and shared Guard types.',
				meta: '4 workspaces',
			},
			{
				label: 'Tests',
				script: 'test',
				description: 'Run API, shared Guard, and available ML tests.',
				meta: 'api · guard · ml',
			},
			{
				label: 'Web lint',
				script: 'lint',
				description: 'Run the client ESLint configuration.',
				meta: 'eslint',
			},
			{
				label: 'Localization',
				script: 'check:i18n',
				description: 'Verify web and extension locale contracts.',
				meta: 'web · extension',
			},
		],
	},
	{
		id: 'system',
		label: 'SYSTEM',
		accent: [251, 191, 36],
		commands: [
			{
				label: 'Project setup',
				script: 'setup',
				description: 'Install workspaces, start PostgreSQL, migrate, and seed.',
				meta: 'first run',
			},
			{
				label: 'Install dependencies',
				script: 'install:all',
				description: 'Install every Bun workspace from the root lockfile.',
				meta: 'bun install',
			},
			{
				label: 'Database up',
				script: 'db:up',
				description: 'Start PostgreSQL and wait until it is healthy.',
				meta: 'docker compose',
			},
			{
				label: 'Database down',
				script: 'db:down',
				description: 'Stop the local database container.',
				meta: 'safe',
			},
			{
				label: 'Database reset',
				script: 'db:reset',
				description: 'Delete local database data, recreate it, migrate, and seed.',
				meta: 'destructive',
			},
			{
				label: 'ML setup',
				script: 'setup:ml',
				description: 'Create the Python 3.12 environment and install ML packages.',
				meta: 'python · optional',
			},
			{
				label: 'Release occupied ports',
				script: 'clean:ports',
				description: 'Stop processes listening on Safe-Net development ports.',
				meta: '3000 · 4200 · 8000',
			},
		],
	},
]

const repoRoot = `${import.meta.dir}/..`
const output = process.stdout
const input = process.stdin
const interactive = Boolean(output.isTTY && input.isTTY)

const esc = '\u001B['
const reset = `${esc}0m`
const bold = (value: string) => `${esc}1m${value}${reset}`
const dim = (value: string) => `${esc}2m${value}${reset}`
const rgb = ([r, g, b]: [number, number, number], value: string) =>
	`${esc}38;2;${r};${g};${b}m${value}${reset}`
const bg = ([r, g, b]: [number, number, number], value: string) =>
	`${esc}48;2;${r};${g};${b}m${value}${reset}`

const palette = {
	text: [226, 232, 240] as [number, number, number],
	muted: [113, 128, 150] as [number, number, number],
	line: [48, 57, 72] as [number, number, number],
	success: [52, 211, 153] as [number, number, number],
}

const stripAnsi = (value: string) => value.replace(/\u001B\[[0-9;]*m/g, '')

const fit = (value: string, width: number) => {
	const plain = stripAnsi(value)
	if (plain.length > width) return `${plain.slice(0, Math.max(0, width - 1))}…`
	return value + ' '.repeat(Math.max(0, width - plain.length))
}

const boxLine = (left: string, right: string, width: number) => {
	const gap = Math.max(1, width - stripAnsi(left).length - stripAnsi(right).length)
	return `│ ${left}${' '.repeat(gap)}${right} │`
}

let categoryIndex = 0
let commandIndex = 0
let activeChild: ReturnType<typeof Bun.spawn> | null = null
let closed = false
let screenActive = false

const currentCategory = () => categories[categoryIndex]!
const currentCommand = () => currentCategory().commands[commandIndex]!

function printableCommands() {
	const lines = ['Safe-Net command center', '']
	for (const category of categories) {
		lines.push(category.label)
		for (const command of category.commands) {
			lines.push(`  bun run ${command.script.padEnd(16)} ${command.description}`)
		}
		lines.push('')
	}
	return lines.join('\n')
}

function render() {
	const width = Math.max(72, Math.min(output.columns || 100, 112))
	const inner = width - 2
	const category = currentCategory()
	const command = currentCommand()
	const actionWidth = Math.max(27, Math.floor(inner * 0.38))
	const detailWidth = inner - actionWidth - 1

	const tabs = categories
		.map((item, index) => {
			const label = ` ${item.label} `
			return index === categoryIndex
				? bg(item.accent, rgb([8, 12, 18], bold(label)))
				: rgb(palette.muted, label)
		})
		.join('  ')

	const lines = [
		`${esc}2J${esc}H`,
		rgb(palette.line, `╭${'─'.repeat(inner)}╮`),
		rgb(
			palette.line,
			boxLine(
				`${rgb(category.accent, bold('SAFE—NET'))}  ${dim('COMMAND CENTER')}`,
				`${rgb(palette.success, '●')} ${dim('workspace ready')}`,
				inner - 2
			)
		),
		rgb(palette.line, `├${'─'.repeat(inner)}┤`),
		rgb(palette.line, `│ ${fit(tabs, inner - 2)} │`),
		rgb(palette.line, `├${'─'.repeat(actionWidth)}┬${'─'.repeat(detailWidth)}┤`),
	]

	const bodyHeight = Math.max(10, Math.min(16, (output.rows || 24) - 9))
	for (let row = 0; row < bodyHeight; row++) {
		const item = category.commands[row]
		let action = ''
		if (item) {
			const selected = row === commandIndex
			const marker = selected ? rgb(category.accent, '◆') : rgb(palette.line, '◇')
			const label = selected ? rgb(palette.text, bold(item.label)) : rgb(palette.muted, item.label)
			action = `${marker} ${label}`
		}

		let detail = ''
		if (row === 1) detail = rgb(category.accent, bold(command.label.toUpperCase()))
		if (row === 3) detail = rgb(palette.muted, fit(command.description, detailWidth - 3))
		if (row === 5) detail = `${dim('COMMAND')}  ${rgb(palette.text, `bun run ${command.script}`)}`
		if (row === 7) detail = `${dim('SCOPE')}    ${rgb(category.accent, command.meta)}`
		if (row === bodyHeight - 2) {
			detail =
				command.script === 'db:reset'
					? rgb([248, 113, 113], '! deletes local database data')
					: rgb(palette.success, '↵ ready to launch')
		}

		lines.push(
			`${rgb(palette.line, '│')} ${fit(action, actionWidth - 2)} ${rgb(palette.line, '│')} ${fit(detail, detailWidth - 2)} ${rgb(palette.line, '│')}`
		)
	}

	lines.push(
		rgb(palette.line, `├${'─'.repeat(actionWidth)}┴${'─'.repeat(detailWidth)}┤`),
		rgb(
			palette.line,
			boxLine(
				`${dim('↑↓')} select   ${dim('←→')} tabs   ${dim('enter')} run`,
				`${dim('q')} quit`,
				inner - 2
			)
		),
		rgb(palette.line, `╰${'─'.repeat(inner)}╯`)
	)

	output.write(lines.join('\n'))
}

function enterScreen() {
	output.write(`${esc}?1049h${esc}?25l`)
	screenActive = true
	input.setRawMode(true)
	input.resume()
	input.setEncoding('utf8')
	render()
}

function leaveScreen() {
	if (!interactive || !screenActive) return
	screenActive = false
	input.setRawMode(false)
	input.pause()
	output.write(`${esc}?25h${esc}?1049l`)
}

function finish(code = 0) {
	if (closed) return
	closed = true
	leaveScreen()
	process.exit(code)
}

async function runSelected() {
	const command = currentCommand()
	input.off('data', onData)
	leaveScreen()
	output.write(
		`\n${rgb(currentCategory().accent, bold('SAFE—NET'))} ${dim('running')} ${rgb(palette.text, `bun run ${command.script}`)}\n\n`
	)

	activeChild = Bun.spawn(['bun', 'run', command.script], {
		cwd: repoRoot,
		stdin: 'inherit',
		stdout: 'inherit',
		stderr: 'inherit',
	})
	const exitCode = await activeChild.exited
	activeChild = null

	output.write(
		`\n${exitCode === 0 ? rgb(palette.success, '✓ completed') : rgb([248, 113, 113], `✕ exited ${exitCode}`)}`
	)
	output.write(dim('  press enter to return, q to quit'))

	input.setRawMode(true)
	input.resume()
	input.setEncoding('utf8')
	input.once('data', value => {
		input.setRawMode(false)
		if (String(value).toLowerCase() === 'q') return finish(exitCode)
		enterScreen()
		input.on('data', onData)
	})
}

function onKey(key: string) {
	if (key === '\u0003') return finish(130)
	if (key === '\r') return void runSelected()
	if (key === '\u001B' || key.toLowerCase() === 'q') return finish()

	if (key === '\u001B[A' || key.toLowerCase() === 'k') {
		commandIndex =
			(commandIndex - 1 + currentCategory().commands.length) %
			currentCategory().commands.length
	}
	if (key === '\u001B[B' || key.toLowerCase() === 'j') {
		commandIndex = (commandIndex + 1) % currentCategory().commands.length
	}
	if (key === '\u001B[D' || key.toLowerCase() === 'h') {
		categoryIndex = (categoryIndex - 1 + categories.length) % categories.length
		commandIndex = 0
	}
	if (key === '\u001B[C' || key.toLowerCase() === 'l' || key === '\t') {
		categoryIndex = (categoryIndex + 1) % categories.length
		commandIndex = 0
	}
	render()
}

function onData(value: string | Buffer) {
	let keys = String(value)
	while (keys.length > 0) {
		if (keys.startsWith('\u001B[') && keys.length >= 3) {
			onKey(keys.slice(0, 3))
			keys = keys.slice(3)
			continue
		}
		onKey(keys[0]!)
		keys = keys.slice(1)
	}
}

process.on('SIGINT', () => {
	if (activeChild) {
		activeChild.kill('SIGINT')
		return
	}
	finish(130)
})
process.on('exit', leaveScreen)

if (process.argv.includes('--list') || !interactive) {
	console.log(printableCommands())
} else {
	enterScreen()
	input.on('data', onData)
}
