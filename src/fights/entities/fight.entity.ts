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
  winnerId: number;

  constructor(idCharacter1: number, idCharacter2: number, winnerId: number) {
    this.character1 = new Character();
    this.character1.id = idCharacter1;
    this.character2 = new Character();
    this.character2.id = idCharacter2;
    this.winnerId = winnerId;
  }

}
