import {
  Controller,
  Get,
  Delete,
  Patch,
  Body,
  Param,
  UseGuards,
  HttpCode,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { UserRoleDto } from './dto/user-role.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserResponseInterface } from './types/user-response.interface';
import { UserListResponseInterface } from './types/user-list-response.interface';
import { ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('users')
export class UsersController {
  constructor( private usersService: UsersService) {}
  
  @Get()
  @ApiTags('Admin')
  async getAllUsers(): Promise<UserListResponseInterface> {
    const users = await this.usersService.getAllUsers();
    return this.usersService.buildUserListResponse(users);
  }

  @Roles(UserRole.USER)
  @Get('/:id')
  async getUserById(@Param('id') id: string): Promise<UserResponseInterface> {
    const user = await this.usersService.getUserById(id);
    return this.usersService.buildUserResponse(user);
  }
  
  @HttpCode(204)
  @Delete('/:id')
  @ApiTags('Admin')
  deleteUser(@Param('id') id: string): Promise<object> {
    return this.usersService.deleteUser(id);
  }

  @Patch('/:id/roles')
  @ApiTags('Admin')
  async updateUserRole(
    @Param('id') id: string,
    @Body() userRoleDto: UserRoleDto,
  ): Promise<UserResponseInterface> {
    const updatedUser = await this.usersService.updateUserRole(id, userRoleDto);
    return this.usersService.buildUserResponse(updatedUser)
  }
  
}
