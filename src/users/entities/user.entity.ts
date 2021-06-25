import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  login: string;

  @Column()
  @Exclude()
  password: string;

  constructor(partialUser: Partial<User>) {
    Object.assign(this, partialUser);
  }
}