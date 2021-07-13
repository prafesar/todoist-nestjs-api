import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

import { Task } from 'src/tasks/task.entity';
import { UserEntity } from 'src/users/user.entity';

@Entity()
export class Comment {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdDate: Date;

  @ManyToOne((_type) => UserEntity, user => user.comments)
  author: UserEntity;

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
