import {
  Controller,
  Get,
  Delete,
  Patch,
  Body,
  Param,
} from '@nestjs/common';

import { User } from './user.entity';
import { UsersService } from './users.service';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Controller('users')
export class UsersController {
  constructor( private usersService: UsersService) {}
  
  @Get()
  getUsers(@Body('email') email: string): Promise<User[] | User> {
    if (email) {
      return this.usersService.getUserByEmail(email);
    }
    return this.usersService.getUsers();
  }

  @Get('/:id')
  getUserById(@Param('id') id: string): Promise<User> {
    return this.usersService.getUserById(id);
  }
  
  @Delete('/:id')
  deleteUser(@Param('id') id: string): Promise<void> {
    return this.usersService.deleteUser(id);
  }

  @Patch('/:id/role')
  async updateUserRole(
    @Param('id') id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ): Promise<User> {
    const { role } = updateUserRoleDto;
    return this.usersService.updateUserRole(id, role)
  }
  
}
