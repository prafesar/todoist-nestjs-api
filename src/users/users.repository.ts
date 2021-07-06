import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './user.entity';
import { UserRole } from './user-role.enum';
import { CreateUserCredentialsDto } from './dto/create-user-credentials.dto';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  
  async createUser(createUserDto: CreateUserCredentialsDto): Promise<void> {
    const { email, login, password } = createUserDto;

    const salt = await bcrypt.genSalt();
    const passHash = await bcrypt.hash(password, salt);
    const role = UserRole.USER;
    const user = this.create({ email, login, passHash, role });
    
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
  }

  async getUsers(): Promise<User[]> {
    return await this.createQueryBuilder("user").getMany();
  }
}
