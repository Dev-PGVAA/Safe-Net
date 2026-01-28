import { adminService } from '@/services/admin/admin.service'
import { useQuery } from '@tanstack/react-query'

export function useCoursesList() {
	const {
		data: courses,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['courses-list'],
		queryFn: () => adminService.getCoursesList(),
	})

	return {
		courses,
		isLoading,
		error,
	}
}
