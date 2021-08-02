import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from '../users/user.entity';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRoleDto } from './dto/user-role.dto';
import { UserRole } from '../common/enums/user-role.enum';
import { UserResponseInterface } from './types/user-response.interface';
import { UserListResponseInterface } from './types/user-list-response.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
  ) {}
    
  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const role = await this.isFirstUser() ? UserRole.ADMIN : UserRole.USER;
    const user = await this.usersRepository.createUser({ ...createUserDto, role });
    delete user.password;
    return user;
  }

  async getAllUsers(): Promise<UserEntity[]> {
    return this.usersRepository.getUsers();
  }

  async getUserById(id: string): Promise<UserEntity> {
    const found = await this.usersRepository.findUserById(id);
    if (!found) {
      throw new NotFoundException(`User with ID: ${id} not found`);
    }
    return found;
  }

  async getUserWithPassByEmail(email: string): Promise<UserEntity> {
    const options = [
      { email },
      { select: ['id', 'login', 'email', 'role', 'password'] }
    ]
    const found = await this.usersRepository.findUser(...options);
    if (!found) {
      throw new NotFoundException(`User with email: ${email} not found`);
    }
    return found;
  }

  async getUserByLogin(login: string): Promise<UserEntity> {
    const found = await this.usersRepository.findUser({ login });
    if (!found) {
      throw new NotFoundException(`User with login: ${login} not found`);
    }
    return found;
  }

  async deleteUser(id: string): Promise<object> {
    const result = await this.usersRepository.deleteUser(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return {}
  }

  async updateUserRole(id: string, userRole: UserRoleDto): Promise<UserEntity> {
    const user = await this.getUserById(id);
    user.role = userRole.role;
    return await this.usersRepository.saveUser(user);
  }

  async isFirstUser(): Promise<boolean> {
    return !Boolean(await this.usersRepository.countUsersWihtRole(UserRole.ADMIN))
  }

  buildUserResponse(user: UserEntity): UserResponseInterface {
    return {
      user: {
        ...user,
      },
    };
  }

  buildUserListResponse(users: UserEntity[]): UserListResponseInterface {
    return {
      users: [
        ...users,
      ],
      count: users.length,
    };
  }

}
