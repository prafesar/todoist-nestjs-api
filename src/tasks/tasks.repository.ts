import { Get, Param } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { TaskPriority } from './task-priority.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

// import { User } from '../auth/user.entity';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {

}