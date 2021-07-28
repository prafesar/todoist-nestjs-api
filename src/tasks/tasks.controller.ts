import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { TaskEntity } from './task.entity';
import { UserEntity } from '../users/user.entity';
import { TasksService } from './tasks.service';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { UpdateTaskPriorityDto } from './dto/update-task-priority.dto';
import { CreateCommentDto } from '../comments/dto/create-comment.dto';
import { GetUser } from '../common/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../common/enums/user-role.enum';
import { Roles } from '../common/decorators/roles.decorator';
import { TaskResponseInterface } from './types/task-response.interface';
import { TaskListResponseInterface } from './types/task-list-response.intreface';
import { DeleteResult } from 'typeorm';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.USER)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getTasks(
    @GetUser() currUser: UserEntity,
  ): Promise<TaskListResponseInterface> {
    const result = await this.tasksService.getTasks(currUser);
    return this.tasksService.buildTaskListResponse(result);
  }

  @Get('/:id')
  async getTaskById(@Param('id') id: string): Promise<TaskResponseInterface> {
    const result = await this.tasksService.getTaskById(id);
    return this.tasksService.buildTaskResponse(result);
  }

  @Roles(UserRole.ADMIN)
  @Delete('/:id')
  deleteTask(@Param('id') id: string): Promise<DeleteResult> {
    return this.tasksService.deleteTask(id);
  }

  @Post('/:id/comments')
  async addCommentToTask(
    @Param('id') taskId: string,
    @Body() commentDto: Pick<CreateCommentDto, 'title' | 'description'>,
    @GetUser() author: UserEntity,
  ): Promise<TaskResponseInterface> {
    const taskWithComments = await this.tasksService.addCommentToTask(taskId, commentDto, author);
    return this.tasksService.buildTaskResponse(taskWithComments);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<TaskEntity> {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTaskStatus(id, status);
  }

  @Patch('/:id/priority')
  updateTaskPriority(
    @Param('id') id: string,
    @Body() updateTaskPriorityDto: UpdateTaskPriorityDto,
  ): Promise<TaskEntity> {
    const { priority } = updateTaskPriorityDto;
    return this.tasksService.updateTaskPriority(id, priority);
  }

}
