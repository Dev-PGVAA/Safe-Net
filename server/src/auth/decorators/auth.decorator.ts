import { JwtAuthGuard } from '../guard/jwt.guard'
import { RolesGuard } from '../guard/roles.guard'
import { Roles } from './roles.decorator'
import { applyDecorators, UseGuards } from '@nestjs/common'
import { Role } from '@prisma/client'

export const Auth = (roles: Role | Role[] = [Role.USER]) => {
	if (!Array.isArray(roles)) {
		roles = [roles]
	}
	return applyDecorators(Roles(...roles), UseGuards(JwtAuthGuard, RolesGuard))
}
