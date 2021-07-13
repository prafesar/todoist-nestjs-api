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
import { Exclude } from 'class-transformer';

import { ProjectStatus } from './project-status.enum';
import { TaskEntity } from 'src/tasks/task.entity';
import { UserEntity } from 'src/users/user.entity';

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

  @ManyToOne((_type) => UserEntity, { eager: true })
  author: UserEntity;
  
  @OneToMany((_type) => TaskEntity, (task) => task.project)
  tasks: Promise<TaskEntity[]>;

  @JoinTable()
  @ManyToMany(
    (_type) => UserEntity,
    user => user.projects,
    {
      cascade: true,
      eager: true,
    }
  )
  users: Promise<UserEntity[]>;

}
