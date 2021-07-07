import { IsEnum } from 'class-validator';

import { UserRole } from '../user-role.enum';

export class UserRoleDto {

  @IsEnum(UserRole)
  role: UserRole;

}
