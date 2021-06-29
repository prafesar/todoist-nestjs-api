import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectStatus } from './project-status.enum';

@Entity()
export class Project {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column() 
  dateCreated: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: ProjectStatus;

}
