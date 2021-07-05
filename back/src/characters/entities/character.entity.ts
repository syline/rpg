import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Fight } from "../../fights/entities/fight.entity";
import { User } from "../../users/entities/user.entity";

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

  @Column({
    nullable: true,
  })
  nextFightTimeMin?: Date;

  @ManyToOne(() => User, user => user.characters, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Fight, fight => fight.attacker)
  fights: Fight[];

  constructor(name?: string, userId?: number) {
    this.skills = 12;
    this.health = 10;
    this.attack = 0;
    this.defense = 0;
    this.magik = 0;
    this.rank = 1;
    this.nextFightTimeMin = null;
    
    if (name) {
      this.name = name;
    }

    if (userId) {
      this.user = new User({ id: userId });
    }
  }
}
