import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../users/user.entity';
import { UserRole } from './user-role.enum';
import { UsersRepository } from './users.repository';
import { CreateUserCredentialsDto } from './dto/create-user-credentials.dto';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
  ) {}
    
  async createUser(createUserDto: CreateUserCredentialsDto): Promise<void> {
    return this.usersRepository.createUser(createUserDto);
  }

  async getUsers(getUserDto: GetUserDto): Promise<User[] | User> {
    const { email, login } = getUserDto;
    if (email) {
      return this.getUserByEmail(email);
    }
    if (login) {
      return this.getUserByLogin(login);
    }
    return this.usersRepository.getUsers();
  }

  async getUserById(id: string): Promise<User> {
    const found = await this.usersRepository.findOne(id);
    if (!found) {
      throw new NotFoundException(`User with ID: ${id} not found`);
    }
    return found;
  }

  async getUserByEmail(email: string): Promise<User> {
    const found = await this.usersRepository.findOne({ email });
    if (!found) {
      throw new NotFoundException(`User with email: ${email} not found`);
    }
    return found;
  }

  async getUserByLogin(login: string): Promise<User> {
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

  async updateUserRole(id: string, role: UserRole): Promise<User> {
    const user = await this.getUserById(id);
    user.role = role;
    await this.usersRepository.save(user);
    return user;
  } 

}
