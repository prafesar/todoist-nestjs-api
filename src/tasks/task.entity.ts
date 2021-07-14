import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { TaskPriority } from '../common/enums/task-priority.enum';
import { TaskStatus } from '../common/enums/task-status.enum';
import { UserEntity } from 'src/users/user.entity';
import { ProjectEntity } from 'src/projects/project.entity';
import { CommentEntity } from 'src/comments/comment.entity';

@Entity({name: 'tasks'})
export class TaskEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdDate: Date;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  @Column()
  priority: TaskPriority;

  @ManyToOne((_type) => UserEntity, (user) => user.tasks)
  author: UserEntity;

  @ManyToOne((_type) => ProjectEntity, (project) => project.tasks)
  project: ProjectEntity;

  @OneToMany(
    (_type) => CommentEntity,
    comment => comment.task,
  )
  comments: CommentEntity[];
  
}
