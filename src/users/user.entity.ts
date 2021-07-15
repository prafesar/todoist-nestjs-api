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
import { ProjectEntity } from '../projects/project.entity';
import { TaskEntity } from '../tasks/task.entity';
import { CommentEntity } from '../comments/comment.entity';

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

  @OneToMany((_type) => TaskEntity, (task) => task.author, {eager: false})
  tasks: TaskEntity[];

  @OneToMany((_type) => CommentEntity, (comment) => comment.author, {eager: false})
  comments: CommentEntity[];

  @ManyToMany(
    (_type) => ProjectEntity,
    project => project.users,
  )
  projects: ProjectEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }

  public isOwner(item: ProjectEntity | TaskEntity | CommentEntity ): boolean {
    const { author } = item;
    return this.id === author.id;
  }

  public isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

}
