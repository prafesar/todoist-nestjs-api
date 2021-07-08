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
import { Task } from 'src/tasks/task.entity';
import { User } from 'src/users/user.entity';

@Entity()
export class Project {

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

  @ManyToOne((_type) => User, { eager: true })
  author: User;
  
  @OneToMany((_type) => Task, (task) => task.project, { eager: true })
  @Exclude({ toPlainOnly: true })
  tasks: Task[];

  @JoinTable()
  @ManyToMany(
    (_type) => User,
    user => user.projects,
    {
      cascade: true,
      eager: true,
    }
  )
  @Exclude({ toPlainOnly: true })
  users: User[];

}
