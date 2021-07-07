import {
  Controller,
  Get,
  Delete,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';

import { User } from './user.entity';
import { UsersService } from './users.service';
import { UserRoleDto } from './dto/user-role.dto';
import { GetUserDto } from './dto/get-user.dto';
import { Role } from 'src/auth/roles.decorator';
import { UserRole } from './user-role.enum';
import { RolesGuard } from 'src/auth/roles.guard';

@UseGuards(RolesGuard)
@Role(UserRole.ADMIN)
@Controller('users')
export class UsersController {
  constructor( private usersService: UsersService) {}
  
  @Role(UserRole.USER)
  @Get()
  getUsers(@Body() getUserDto: GetUserDto): Promise<User[] | User> {
    return this.usersService.getUsers(getUserDto);
  }

  @Role(UserRole.USER)
  @Get('/:id')
  getUserById(@Param('id') id: string): Promise<User> {
    return this.usersService.getUserById(id);
  }
  
  @Delete('/:id')
  deleteUser(@Param('id') id: string): Promise<void> {
    return this.usersService.deleteUser(id);
  }

  @Patch('/:id/roles')
  async updateUserRole(
    @Param('id') id: string,
    @Body() userRoleDto: UserRoleDto,
  ): Promise<User> {
    return this.usersService.updateUserRole(id, userRoleDto);
  }
  
}
