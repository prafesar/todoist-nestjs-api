import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UserEntity } from './user.entity';
import { UserRole } from '../common/enums/user-role.enum';
import { CreateUserDto } from './dto/create-user.dto';

@EntityRepository(UserEntity)
export class UsersRepository extends Repository<UserEntity> {
  
  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const role = await this.isFirstUser() ? UserRole.ADMIN : UserRole.USER;
    const user = this.create({ ...createUserDto, role });
    
    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        // duplicate username
        throw new ConflictException(`User already exists`);
      } else {
        throw new InternalServerErrorException();
      }
    }
    return user;
  }

  async isFirstUser(): Promise<boolean> {
    const [ , count] = await this.findAndCount({
      where: [
        { role: UserRole.ADMIN },
      ]
    })
    return !Boolean(count)
  }

  async getUsers(): Promise<UserEntity[]> {
    return await this.find()
  }
}
