import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Unique
} from 'typeorm';

@Entity()
@Unique(['login', 'email'])
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdDate: Date;
  
  @Column()
  login: string;

  @Column() 
  email: string;

  @Column()
  passHash: string;

}
