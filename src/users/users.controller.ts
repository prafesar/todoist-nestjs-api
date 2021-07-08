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
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('users')
export class UsersController {
  constructor( private usersService: UsersService) {}
  
  @Roles(UserRole.USER)
  @Get()
  getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @Roles(UserRole.USER)
  @Get('/find')
  getUser(@Body() getUserDto: GetUserDto): Promise<User> {
    return this.usersService.getUser(getUserDto);
  }

  @Roles(UserRole.USER)
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
