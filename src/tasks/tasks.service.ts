import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ProjectEntity } from '../projects/project.entity';
import { UserEntity } from '../users/user.entity';
import { TaskEntity } from './task.entity';
import { TaskPriority } from '../common/enums/task-priority.enum';
import { TaskStatus } from '../common/enums/task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksRepository } from './tasks.repository';
import { CommentsService } from '../comments/comments.service';
import { CreateCommentDto } from '../comments/dto/create-comment.dto';
import { TaskResponseInterface } from './types/task-response.interface';
import { TaskListResponseInterface } from './types/task-list-response.intreface';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
    private readonly commentsService: CommentsService,
  ) {}

  getTasks(currUser: UserEntity): Promise<TaskEntity[]> {
    return this.tasksRepository.getTasks(currUser);
  }

  async getTaskById(id: string): Promise<TaskEntity> {
    const found = await this.tasksRepository.getTaskById(id);
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

  buildTaskListResponse(tasks: TaskEntity[]): TaskListResponseInterface {
    const result = tasks.map(task => this.buildTaskResponse(task).task);
    return {
      tasks: result,
      count: result.length,
    }
  }

}
