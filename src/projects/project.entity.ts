import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { ProjectStatus } from './project-status.enum';
import { TaskEntity } from '../tasks/task.entity';
import { UserEntity } from '../users/user.entity';

@Entity({name: 'projects'})
export class ProjectEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdDate: Date;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: ProjectStatus;

  @ManyToOne((_type) => UserEntity)
  author: UserEntity;
  
  @OneToMany((_type) => TaskEntity, (task) => task.project)
  tasks: TaskEntity[];

  @JoinTable()
  @ManyToMany(
    (_type) => UserEntity,
    user => user.projects,
    {
      cascade: true,
    }
  )
  users: UserEntity[];

}
