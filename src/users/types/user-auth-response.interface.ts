import { UserType } from './user.type';

export interface UserAuthResponseInterface {
  user: UserType & { token: string, strategy: string };
}
