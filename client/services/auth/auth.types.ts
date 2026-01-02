export enum UserRole {
	USER = 'USER',
	ADMIN = 'ADMIN'
}
export interface ITokenInside {
	id: string
	rights: UserRole[]
	iat: number
	exp: number
}
export type TProtectUserData = Omit<ITokenInside, 'iat' | 'exp'> & {
	name?: string
	email?: string
}
export interface IUser {
	id: string
	name?: string
	email: string
	rights: UserRole[]
}
export interface IFormData extends Pick<IUser, 'name' | 'email'> {
	password: string
}
