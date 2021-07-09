import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { Task } from './task.entity';
import { User } from 'src/users/user.entity';
import { Comment } from 'src/comments/comment.entity';
import { TasksService } from './tasks.service';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { UpdateTaskPriorityDto } from './dto/update-task-priority.dto';
import { CreateCommentDto } from 'src/comments/dto/create-comment.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { CommentsService } from 'src/comments/comments.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from 'src/common/enums/user-role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.USER)
@Controller('tasks')
export class TasksController {
  constructor(
    private tasksService: TasksService,
    private commentsService: CommentsService,
  ) {}

  @Get()
  getTasks(@Query() filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksService.getTasks(filterDto);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string): Promise<void> {
    return this.tasksService.deleteTask(id);
  }

  @Post('/:id/comments')
  async addCommentToTask(
    @Param('id') taskId: string,
    @Body('title') title: string,
    @Body('description') description: string,
    @GetUser() author: User,
  ): Promise<Comment> {
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
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTaskStatus(id, status);
  }

  @Patch('/:id/priority')
  updateTaskPriority(
    @Param('id') id: string,
    @Body() updateTaskPriorityDto: UpdateTaskPriorityDto,
  ): Promise<Task> {
    const { priority } = updateTaskPriorityDto;
    return this.tasksService.updateTaskPriority(id, priority);
  }

}
