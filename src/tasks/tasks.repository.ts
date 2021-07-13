import { EntityRepository, Repository } from 'typeorm';

import { UserEntity } from 'src/users/user.entity';
import { TaskEntity } from './task.entity';
import { CommentEntity } from 'src/comments/comment.entity';
import { ProjectEntity } from 'src/projects/project.entity';
import { TaskStatus } from '../common/enums/task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskPriority } from '../common/enums/task-priority.enum';
import { CreateCommentDto } from 'src/comments/dto/create-comment.dto';

@EntityRepository(TaskEntity)
export class TasksRepository extends Repository<TaskEntity> {

  async getTasks(filterDto: GetTasksFilterDto): Promise<TaskEntity[]> {
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
    project: ProjectEntity,
    author : UserEntity,
    createTaskDto: CreateTaskDto,
  ): Promise<TaskEntity> {
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
