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

import { UserEntity } from './user.entity';
import { UsersService } from './users.service';
import { UserRoleDto } from './dto/user-role.dto';
import { GetUserDto } from './dto/get-user.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('users')
export class UsersController {
  constructor( private usersService: UsersService) {}
  
  @Get()
  getAllUsers(): Promise<UserEntity[]> {
    return this.usersService.getAllUsers();
  }

  @Roles(UserRole.USER)
  @Get('/:id')
  getUserById(@Param('id') id: string): Promise<UserEntity> {
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
  ): Promise<UserEntity> {
    return this.usersService.updateUserRole(id, userRoleDto);
  }
  
}
