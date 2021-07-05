import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Character } from "../../characters/entities/character.entity";
import { Fighter } from "../models/fighter";

@Entity()
export class Fight {

  @PrimaryGeneratedColumn()
  id: number;
  
  @ManyToOne(() => Character, character => character.fights, { onDelete: 'CASCADE' })
  @JoinColumn()
  attacker: Character;

  @ManyToOne(() => Character, character => character.fights, { onDelete: 'CASCADE' })
  @JoinColumn()
  defender: Character;

  @Column()
  winnerId: number;

  constructor(attacker: Fighter, defender: Fighter, winnerId: number) {
    this.attacker = new Character();
    Object.assign(this.attacker, attacker);
    
    this.defender = new Character();
    Object.assign(this.defender, defender);
    
    this.winnerId = winnerId;
  }
}
