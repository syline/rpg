import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Character } from "../../characters/entities/character.entity";

@Entity()
export class Fight {

  @PrimaryGeneratedColumn()
  id: number;
  
  @ManyToOne(() => Character, character => character.fights)
  @JoinColumn()
  attacker: Character;

  @ManyToOne(() => Character, character => character.fights)
  @JoinColumn()
  defender: Character;

  @Column()
  winnerId: number;

  constructor(attackerId: number, defenderId: number, winnerId: number) {
    this.attacker = new Character();
    this.attacker.id = attackerId;
    this.defender = new Character();
    this.defender.id = defenderId;
    this.winnerId = winnerId;
  }

}
