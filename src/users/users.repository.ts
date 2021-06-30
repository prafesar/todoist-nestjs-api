import { EntityRepository, Repository } from 'typeorm';

import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserFilterDto } from './dto/get-user-filter.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

}
