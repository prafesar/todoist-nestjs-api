import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

import { ProjectStatus } from './project-status.enum';

@Entity()
export class Project {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  authorId: string;

  @CreateDateColumn()
  createdDate: Date;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: ProjectStatus;

}
