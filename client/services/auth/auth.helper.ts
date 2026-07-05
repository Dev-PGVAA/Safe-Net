import Cookies from 'js-cookie'
import { EnumTokens } from './auth.service'

export const getAccessToken = () => {
	const accessToken = Cookies.get(EnumTokens.ACCESS_TOKEN)
	return accessToken || null
}
export const saveTokenStorage = (accessToken: string) => {
	Cookies.set(EnumTokens.ACCESS_TOKEN, accessToken, {
		sameSite: 'strict',
		expires: 1,
		path: '/',
	})
}

export const removeFromStorage = () => {
	Cookies.remove(EnumTokens.ACCESS_TOKEN, {
		sameSite: 'strict',
		path: '/',
	})
}
