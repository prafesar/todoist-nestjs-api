import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

import { Task } from 'src/tasks/task.entity';
import { User } from 'src/users/user.entity';

@Entity()
export class Comment {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdDate: Date;

  @ManyToOne((_type) => User, user => user.comments)
  author: User;

  @Column()
  title: string;

  @Column()
  description: string;
  
  @ManyToOne(
    (_type) => Task,
    task => task.comments,
  )
  task: Task;

}
