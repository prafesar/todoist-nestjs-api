import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../users/user-role.enum';

export const ROLE_KEY = 'role';
export const Role = (role: UserRole) => SetMetadata(ROLE_KEY, role);