import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  ManyToMany,
  BeforeInsert,
} from 'typeorm';
import { hash } from 'bcrypt';

import { UserRole } from '../common/enums/user-role.enum';
import { Project } from 'src/projects/project.entity';
import { Task } from 'src/tasks/task.entity';
import { Comment } from '../comments/comment.entity';

@Entity({name: 'users'})
export class UserEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdDate: Date;
  
  @Column(({ unique: true })) 
  email: string;

  @Column(({ unique: true })) 
  login: string;

  @Column({ select: false })
  password: string;

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

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }

}
