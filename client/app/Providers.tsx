'use client'
import { LazyMotion, domAnimation } from 'framer-motion'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren, useState } from 'react'
import { Toaster } from 'sonner'

export function Providers({ children }: PropsWithChildren) {
	const [client] = useState(new QueryClient())
	return (
		<QueryClientProvider client={client}>
			<LazyMotion features={domAnimation}>{children}</LazyMotion>
			<Toaster position='top-right' theme='system' richColors expand />
		</QueryClientProvider>
	)
}
