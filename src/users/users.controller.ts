import {
  Controller,
  Get,
  Delete,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { User } from './user.entity';
import { UsersService } from './users.service';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { GetUserDto } from './dto/get-user.dto';

@UseGuards(AuthGuard())
@Controller('users')
export class UsersController {
  constructor( private usersService: UsersService) {}
  
  @Get()
  getUsers(@Body() getUserDto: GetUserDto): Promise<User[] | User> {
    return this.usersService.getUsers(getUserDto);
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
