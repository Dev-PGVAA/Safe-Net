import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { TProtectUserData } from 'src/types/auth.types'

export const CurrentUser = createParamDecorator(
	(data: keyof TProtectUserData | undefined, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest()
		const user = request.user as TProtectUserData | undefined
		if (!user) return null
		return data ? user[data] : user
	}
)
