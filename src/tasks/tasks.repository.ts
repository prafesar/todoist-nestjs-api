import { EntityRepository, Repository } from 'typeorm';

import { UserEntity } from '../users/user.entity';
import { TaskEntity } from './task.entity';
import { ProjectEntity } from '../projects/project.entity';
import { TaskStatus } from '../common/enums/task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskPriority } from '../common/enums/task-priority.enum';

@EntityRepository(TaskEntity)
export class TasksRepository extends Repository<TaskEntity> {

  async getTasks(currUser: UserEntity): Promise<TaskEntity[]> {
    return await this.find({
      relations: ['author', 'project'],
      where: {
        author: {
          id: currUser.id
        }
      }
    })
  }

  async getTaskById(id: string) {
    return await this.findOne(id, {
      relations: ['author', 'project']
    })
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

    return await this.save(task);
  }

}
