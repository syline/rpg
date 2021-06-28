import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Character } from "../../characters/entities/character.entity";

@Entity()
export class Fight {

  @PrimaryGeneratedColumn()
  id: number;
  
  @ManyToOne(() => Character, character => character.fights)
  @JoinColumn()
  character1: Character;

  @ManyToOne(() => Character, character => character.fights)
  @JoinColumn()
  character2: Character;

  @Column()
  character1Score: number;

  @Column()
  character2Score: number;

}
