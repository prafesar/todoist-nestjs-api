import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from '../users/user.entity';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRoleDto } from './dto/user-role.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
  ) {}
    
  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.usersRepository.createUser(createUserDto);
  }

  async getAllUsers(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  async getUserById(id: string): Promise<UserEntity> {
    const found = await this.usersRepository.findOne(id);
    if (!found) {
      throw new NotFoundException(`User with ID: ${id} not found`);
    }
    return found;
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    const found = await this.usersRepository.findOne(
      { email },
      { select: ['id', 'login', 'email', 'role', 'password'] },
    );
    if (!found) {
      throw new NotFoundException(`User with email: ${email} not found`);
    }
    return found;
  }

  async getUserByLogin(login: string): Promise<UserEntity> {
    const found = await this.usersRepository.findOne({ login });
    if (!found) {
      throw new NotFoundException(`User with login: ${login} not found`);
    }
    return found;
  }

  async deleteUser(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
  }

  async updateUserRole(id: string, userRole: UserRoleDto): Promise<UserEntity> {
    const user = await this.getUserById(id);
    user.role = userRole.role;
    await this.usersRepository.save(user);
    return user;
  } 

}
