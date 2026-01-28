import { instance } from '@/api/axios'

export interface IPublicStats {
	totalUsers: number
	totalTasks: number
	averageAccuracy: number
	totalLessons: number
}

class PublicService {
	async getStats(): Promise<IPublicStats> {
		return (await instance.get<IPublicStats>('/public/stats')).data
	}
}

export const publicService = new PublicService()
