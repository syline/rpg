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

  isHarmless(): boolean {
    return this.attack === 0;
  }

  isAlive(): boolean {
    return this.health > 0;
  }

  // getAttackDamages(defense: number): number {
  //   const dice = new Dice(this.attack);
  //   const attack = dice.getValue();
  //   let damages = 0;

  //   if (attack > defense) {
  //     damages = attack - defense;

  //     if (damages === this.magik) {
  //       damages *= 2;
  //     }
  //   }

  //   return damages;
  // }

  // sufferDamage(damages: number): void {
  //   this.health -= damages;
  // }

  // levelUp(): void {
  //   this.rank++
  //   this.skills++;
  // }

  // levelDown(): void {
  //   if (this.rank > 1) {
  //     this.rank--;
  //   }
  //   this.nextFightTimeMin = this.getNextHour();
  // }
 
  // private getNextHour(): Date {
  //   const nextHour = new Date();
  //   nextHour.setHours(new Date().getHours() + 1);

  //   return nextHour;
  // }

  // heal(): void {
  //   this.health = 12;
  // }
}
