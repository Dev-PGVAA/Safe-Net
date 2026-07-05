import { Geist, Geist_Mono } from 'next/font/google'

import { SITE_NAME } from '@/constants/seo.constants'
import type { Metadata } from 'next'
import { Providers } from './Providers'
import './globals.css'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})
const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})
export const metadata: Metadata = {
	title: {
		default: SITE_NAME,
		template: `%s | ${SITE_NAME}`,
	},
	description: 'Cybersecurity Training Simulator',
	icons: '/favicon.ico',
}
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-900 text-slate-100`}
			>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
