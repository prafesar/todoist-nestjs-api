import { CreateUserDto } from "../../users/dto/create-user.dto";
import { UserEntity } from "../../users/user.entity";
import { UserRole } from "../enums/user-role.enum";

const userDto: CreateUserDto = {
  email: 'federal@fsb.ru',
  login: 'federal',
  password: 'password',
};

const mockUser: UserEntity = Object.assign(
  new UserEntity(),
  userDto,
  {
    role: UserRole.USER,
    id: 'someId',
  },
);

const mockAdmin: UserEntity = Object.assign(
  new UserEntity(),
  mockUser,
  { role: UserRole.ADMIN },
);

const mockUsersService = () => ({});

export { mockUsersService, mockAdmin, mockUser };