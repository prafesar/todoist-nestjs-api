import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  login: string;

  @Column() 
  email: string;

  @Column()
  passHash: string;

}
