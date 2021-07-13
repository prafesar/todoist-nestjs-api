import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

import { TaskEntity } from 'src/tasks/task.entity';
import { UserEntity } from 'src/users/user.entity';

@Entity({name: 'comments'})
export class CommentEntity {

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
    (_type) => TaskEntity,
    task => task.comments,
  )
  task: TaskEntity;

}
