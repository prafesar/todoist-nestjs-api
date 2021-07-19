import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

import { UserEntity } from './user.entity';
import { UserRole } from '../common/enums/user-role.enum';
import { CreateUserDto } from './dto/create-user.dto';

@EntityRepository(UserEntity)
export class UsersRepository extends Repository<UserEntity> {
  
  async createUser(createDto: CreateUserDto & { role: UserRole}): Promise<UserEntity> {
    const user = this.create(createDto)
    try {
      await this.saveUser(user);
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

  async saveUser(user: UserEntity): Promise<UserEntity> {
    return this.save(user);
  }

  async deleteUser(userId: string): Promise<any> {
    return await this.delete(userId);
  }

  async countUsersWihtRole(role: UserRole): Promise<number> {
    const [ , count] = await this.findAndCount({
      where: [
        { role },
      ]
    });
    return count;
  }

  async findUser(...options: object[]): Promise<UserEntity> {
    return await this.findOne(...options)
  }
}
