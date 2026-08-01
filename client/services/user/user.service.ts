import { instance } from '@/api/axios'
import { IUser } from '@/services/auth/auth.types'


class UserService {
	private _BASE_URL = '/user'
	async fetchProfile() {
		return instance.get<IUser>(`${this._BASE_URL}/profile`)
	}
}
const userService = new UserService()
export default userService
