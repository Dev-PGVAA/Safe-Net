import { useParams } from 'next/navigation'

import { learningService } from '@/services/learning/learning.service'
import { useQuery } from '@tanstack/react-query'


export function useCourseDetail() {
	const params = useParams()
	const slug = params?.slug as string
	const courseQuery = useQuery({
		queryKey: ['course', slug],
		queryFn: () => learningService.getCourseDetail(slug),
		enabled: !!slug
	})
	return {
		course: courseQuery.data,
		isLoading: courseQuery.isLoading,
		lessons: courseQuery.data?.lessons ?? [],
		tests: courseQuery.data?.tests ?? []
	}
}
