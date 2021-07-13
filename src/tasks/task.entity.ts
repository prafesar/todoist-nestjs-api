import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { TaskPriority } from '../common/enums/task-priority.enum';
import { TaskStatus } from '../common/enums/task-status.enum';
import { UserEntity } from 'src/users/user.entity';
import { Project } from 'src/projects/project.entity';
import { Comment } from 'src/comments/comment.entity';

@Entity()
export class Task {

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

  @ManyToOne((_type) => UserEntity, (user) => user.tasks, { eager: false })
  @Exclude({ toPlainOnly: true })
  author: UserEntity;

  @ManyToOne((_type) => Project, (project) => project.tasks, { eager: false })
  project: Project;

  @OneToMany(
    (_type) => Comment,
    comment => comment.task,
    { eager: false },
  )
  comments: Comment[];
  
}
