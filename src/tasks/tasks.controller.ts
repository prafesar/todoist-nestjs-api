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
import { CommentEntity } from '../comments/comment.entity';
import { TasksService } from './tasks.service';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { UpdateTaskPriorityDto } from './dto/update-task-priority.dto';
import { CreateCommentDto } from '../comments/dto/create-comment.dto';
import { GetUser } from '../common/decorators/get-user.decorator';
import { CommentsService } from '../comments/comments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../common/enums/user-role.enum';
import { Roles } from '../common/decorators/roles.decorator';
import { TaskResponseInterface } from './types/task-response.interface';
import { TaskListResponseInterface } from './types/task-list-response.intreface';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.USER)
@Controller('tasks')
export class TasksController {
  constructor(
    private tasksService: TasksService,
    private commentsService: CommentsService,
  ) {}

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
  deleteTask(@Param('id') id: string): Promise<void> {
    return this.tasksService.deleteTask(id);
  }

  @Post('/:id/comments')
  async addCommentToTask(
    @Param('id') taskId: string,
    @Body('title') title: string,
    @Body('description') description: string,
    @GetUser() author: UserEntity,
  ): Promise<CommentEntity> {
    const task = await this.tasksService.getTaskById(taskId);
    const createCommentDto: CreateCommentDto = {
      task,
      author,
      title,
      description,
    }
    return this.commentsService.createComment(createCommentDto);
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
