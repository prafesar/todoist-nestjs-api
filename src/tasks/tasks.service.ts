import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ProjectEntity } from 'src/projects/project.entity';
import { UserEntity } from 'src/users/user.entity';
import { TaskEntity } from './task.entity';
import { CommentEntity } from 'src/comments/comment.entity';
import { TaskPriority } from '../common/enums/task-priority.enum';
import { TaskStatus } from '../common/enums/task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { CommentsService } from 'src/comments/comments.service';
import { CreateCommentDto } from 'src/comments/dto/create-comment.dto';
import { TaskResponseInterface } from './types/task-response.interface';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
    private readonly commentsService: CommentsService,
  ) {}

  getTasks(filterDto: GetTasksFilterDto): Promise<TaskEntity[]> {
    return this.tasksRepository.getTasks(filterDto);
  }

  async getTaskById(id: string): Promise<TaskEntity> {
    const found = await this.tasksRepository.findOne(id);
    if (!found) {
      throw new NotFoundException(`Task with ID: ${id} not found`);
    }
    return found;
  }

  async addCommentForTask(
    task: TaskEntity,
    dto: CreateCommentDto,
    author: UserEntity
  ): Promise<any> {
    return 'add comment for task';
  }

  async createTask(
    project: ProjectEntity,
    author : UserEntity,
    createTaskDto: CreateTaskDto
  ): Promise<TaskEntity> {
    return this.tasksRepository.createTask(project, author, createTaskDto);
  }

  async deleteTask(id: string): Promise<void> {
    const result = await this.tasksRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<TaskEntity> {
    const task = await this.getTaskById(id);

    task.status = status;
    await this.tasksRepository.save(task);

    return task;
  }

  async updateTaskPriority(id: string, priority: TaskPriority): Promise<TaskEntity> {
    const task = await this.getTaskById(id);

    task.priority = priority;
    await this.tasksRepository.save(task);

    return task;
  }

  buildTaskResponse(task: TaskEntity): TaskResponseInterface {
    const { author, project, ...rest } = task;
    return {
      task: {
        ...rest,
        authorId: author.id,
        projectId: project.id
      },
    };
  }

}
