import { learningService } from '@/services/learning/learning.service'
import { useQuery } from '@tanstack/react-query'

export function useCourses(tab: 'active' | 'completed' | 'all' = 'active') {
	const query = useQuery({
		queryKey: ['user', 'courses', tab],
		queryFn: async () => {
			if (tab === 'active') {
				const [allCourses, completedCourses] = await Promise.all([
					learningService.getUserCourses(),
					learningService.getCompletedCourses(),
				])
				const completedIds = new Set(completedCourses.map(c => c.id))
				return allCourses.filter(course => !completedIds.has(course.id))
			} else if (tab === 'completed') {
				return learningService.getCompletedCourses()
			} else {
				return learningService.getUserCourses()
			}
		},
	})

	return {
		courses: query.data ?? [],
		isLoading: query.isLoading,
		isError: query.isError,
	}
}
