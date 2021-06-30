import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './user.entity';
import { UserRole } from './user-role.enum';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { email, password } = authCredentialsDto;

    if (await this.findOne({ email })) {
      throw new ConflictException(`User with email: "${email}" already exists`);
    }

    const salt = await bcrypt.genSalt();
    const passHash = await bcrypt.hash(password, salt);
    const role = UserRole.USER;
    const user = this.create({ email, passHash, role });
    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        // duplicate username
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getUsers(filterDto: GetUsersFilterDto): Promise<User[]>  {
    const { projectId, search } = filterDto;
    
    const query = this.createQueryBuilder('user');

    if (search) {
      query.andWhere(
        'LOWER(user.email) LIKE LOWER(:search) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    return await query.getMany();
  }
}
