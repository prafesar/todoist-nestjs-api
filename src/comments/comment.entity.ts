import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Comment {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column() 
  dateCreated: string;

  @Column()
  user_id: string;

  @Column()
  task_id: string;

  @Column()
  title: string;

  @Column()
  description: string;

}
