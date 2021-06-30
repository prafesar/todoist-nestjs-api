import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Unique
} from 'typeorm';

import { UserRole } from './user-role.enum';

@Entity()
@Unique(['email'])
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdDate: Date;
  
  @Column() 
  email: string;

  @Column()
  passHash: string;

  @Column()
  role: UserRole;

}
