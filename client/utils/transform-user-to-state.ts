import { UserRole } from '@/services/auth/auth.types'


export type TUserDataState = {
	id: string
	name?: string
	email?: string
	rights: UserRole[]
	isLoggedIn: boolean
	isAdmin: boolean
}
export const transformUserToState = (user: any): TUserDataState | null => {
	const userData = user?.user || user
	if (!userData || !userData.rights) {
		return null
	}
	const result = {
		id: userData.id,
		name: userData.name,
		email: userData.email,
		rights: userData.rights,
		isLoggedIn: true,
		isAdmin: userData.rights.includes(UserRole.ADMIN)
	}
	return result
}
