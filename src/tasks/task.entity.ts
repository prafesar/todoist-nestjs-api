import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

import { TaskPriority } from './task-priority.enum';
import { TaskStatus } from './task-status.enum';

@Entity()
export class Task {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @Column()
  // authorId: string;

  // @Column()
  // prjectId: string;

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

}
