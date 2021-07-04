import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Character } from '../../characters/entities/character.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  login: string;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => Character, character => character.user)
  characters: Character[];

  constructor(partialUser: Partial<User>) {
    Object.assign(this, partialUser);
  }
}