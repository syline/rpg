import { User } from "../../users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Character {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  skills: number;

  @Column()
  health: number;

  @Column()
  attack: number;

  @Column()
  defense: number;

  @Column()
  magik: number;

  @Column()
  rank: number;

  @ManyToOne(() => User, user => user.characters)
  user: User;

  constructor() {
    this.skills = 12;
    this.health = 10;
    this.attack = 0;
    this.defense = 0;
    this.magik = 0;
    this.rank = 1;
  }
}
