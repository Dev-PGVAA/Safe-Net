'use client'

import { learningService } from '@/services/learning/learning.service'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

export function useCertificateDetail() {
	const params = useParams()
	const certificateId = params.id as string

	const {
		data: certificate,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ['certificate', certificateId],
		queryFn: () => learningService.getCertificate(certificateId),
		enabled: !!certificateId,
	})

	return {
		certificate: certificate || null,
		isLoading,
		isError,
	}
}
