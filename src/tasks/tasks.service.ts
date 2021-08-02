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
import { DeleteResult } from 'typeorm';

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

  async addCommentToTask(
    taskId: string,
    dto: Pick<CreateCommentDto, 'title' | 'description'>,
    author: UserEntity
  ): Promise<any> {
    const task = await this.getTaskById(taskId);
    const createCommentDto: CreateCommentDto = {
      task,
      author,
      ...dto,
    }
    await this.commentsService.createComment(createCommentDto);
    return await this.getTaskById(taskId);
  }

  async createTask(
    project: ProjectEntity,
    author : UserEntity,
    createTaskDto: CreateTaskDto
  ): Promise<TaskEntity> {
    return this.tasksRepository.createTask(project, author, createTaskDto);
  }

  async deleteTask(id: string): Promise<DeleteResult> {
    const result = await this.tasksRepository.deleteTaskById(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return result;
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<TaskEntity> {
    const task = await this.getTaskById(id);

    task.status = status;
    await this.tasksRepository.saveTask(task);

    return task;
  }

  async updateTaskPriority(id: string, priority: TaskPriority): Promise<TaskEntity> {
    const task = await this.getTaskById(id);

    task.priority = priority;
    await this.tasksRepository.saveTask(task);

    return task;
  }

  buildTaskResponse(task: TaskEntity): TaskResponseInterface {
    const { author, project, comments, ...rest } = task;
    const commentIds = comments.map(comment => comment.id)
    return {
      task: {
        ...rest,
        authorId: author.id,
        projectId: project.id,
        comments: commentIds,
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
