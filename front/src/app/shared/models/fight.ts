import { FightDto } from '../dto/fight.dto';
import { Character } from './character';

export class Fight {
  id: number;
  attacker: Character;
  defender: Character;
  winner: Character;

  constructor(fightDto: FightDto) {
    this.id = fightDto.id;
    this.attacker = new Character(fightDto.attacker);
    this.defender = new Character(fightDto.defender);
    if (fightDto.winnerId === fightDto.attacker.id) {
      this.winner = this.attacker;
    } else {
      this.winner = this.defender;
    }
  }
}
