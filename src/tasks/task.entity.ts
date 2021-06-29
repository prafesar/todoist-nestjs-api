import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { TaskPriority } from './task-priority.enum';
import { TaskStatus } from './task-status.enum';

@Entity()
export class Task {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column() 
  dateCreated: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  @Column()
  priority: TaskPriority;

}
