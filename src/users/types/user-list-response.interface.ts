import { UserType } from './user.type';

export interface UserListResponseInterface {
  users: UserType[];
  count: number;
}
