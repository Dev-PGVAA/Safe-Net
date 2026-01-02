interface DashboardPages {
	readonly HOME: string
	readonly COURSES: string
	readonly TESTS: string
	readonly CERTIFICATES: string
	readonly ADMIN: {
		readonly ROOT: string
		readonly USERS: string
		readonly COURSES: string
		readonly STATS: string
	}
}
class Dashboard implements DashboardPages {
	private readonly root: string = '/dashboard'
	readonly HOME: string
	readonly COURSES = `${this.root}/courses` as const
	readonly CERTIFICATES: string
	readonly TESTS: string
	readonly ADMIN = {
		ROOT: `${this.root}/admin`,
		USERS: `${this.root}/admin/users`,
		COURSES: `${this.root}/admin/courses`,
		STATS: `${this.root}/admin/stats`,
	} as const
	constructor() {
		this.HOME = this.root
		this.CERTIFICATES = `${this.root}/certificates`
		this.TESTS = `${this.root}/tests`
	}
}
export const ROUTES = new Dashboard()
