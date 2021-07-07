import { EntityRepository, Repository } from 'typeorm';

import { User } from 'src/users/user.entity';
import { Task } from './task.entity';
import { Comment } from 'src/comments/comment.entity';
import { Project } from 'src/projects/project.entity';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskPriority } from './task-priority.enum';
import { CreateCommentDto } from 'src/comments/dto/create-comment.dto';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const {
      status,
      priority,
      search,
      // projectId,
      // userId,
    } = filterDto;

    const query = this.createQueryBuilder('task');
    
    // projectId && query.andWhere ('task.project = :project', { projectId });
    status && query.andWhere('task.status = :status', { status });
    priority && query.andWhere('task.priority = :priority', { priority });
    
    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }

  async createTask(
    project: Project,
    author : User,
    createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    const { title, description } = createTaskDto;
    
    const task = this.create({
      project,
      author,
      title,
      description,
      status: TaskStatus.OPEN,
      priority: TaskPriority.MEDIUM,
    });

    await this.save(task);
    return task;
  }

}
