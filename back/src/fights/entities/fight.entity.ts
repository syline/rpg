import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Character } from "../../characters/entities/character.entity";

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

  constructor(attacker: Character, defender: Character, winnerId: number) {
    this.attacker = attacker;
    this.defender = defender;
    this.winnerId = winnerId;
  }
  // winner: Character;

  // looser: Character;

  // constructor(attacker: Character, defender: Character) {
  //   this.attacker = attacker;
  //   this.defender = defender;
  // }

  // start(): IRound[] {
  //   const rounds: IRound[] = [];
  //   let nbRound = 1;

  //   while (this.attacker.isAlive() && this.defender.isAlive()) {
  //     const defenderDamagesReceived = this.attacker.getAttackDamages(this.defender.defense);
  //     this.defender.sufferDamage(defenderDamagesReceived);

  //     if (!this.defender.isAlive()) {
  //       rounds.push({ id: nbRound, defenderDamagesReceived, attackerDamagesReceived: 0 });
  //       this.setFightResults(this.attacker, this.defender);
  //       break;
  //     }

  //     const attackerDamagesReceived = this.defender.getAttackDamages(this.attacker.defense);
  //     this.attacker.sufferDamage(attackerDamagesReceived);

  //     rounds.push({ id: nbRound, defenderDamagesReceived, attackerDamagesReceived });

  //     nbRound++;
  //   }

  //   this.setFightResults(this.defender, this.attacker);

  //   return rounds;
  // }

  // private setFightResults(winner: Character, looser: Character): void {
  //   this.winnerId = winner.id;
  //   this.winner = winner;
  //   this.looser = looser;
  // }
}
