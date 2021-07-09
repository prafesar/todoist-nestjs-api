import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';

import { UserRole } from '../common/enums/user-role.enum';
import { Project } from 'src/projects/project.entity';
import { Task } from 'src/tasks/task.entity';
import { Comment } from '../comments/comment.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdDate: Date;
  
  @Column(({ unique: true })) 
  email: string;

  @Column(({ unique: true })) 
  login: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  passHash: string;

  @Column()
  role: UserRole;

  @OneToMany((_type) => Task, (task) => task.author, {eager: false})
  tasks: Task[];

  @OneToMany((_type) => Comment, (comment) => comment.author, {eager: false})
  comments: Comment[];

  @ManyToMany(
    (_type) => Project,
    project => project.users,
  )
  projects: Project[];

}
