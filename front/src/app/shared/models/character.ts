import { CharacterDto } from '../dto/character.dto';
import { Fight } from './fight';
import { User } from './user';

export class Character {
  id: number;
  name: string;
  skills: number;
  health: number;
  attack: number;
  defense: number;
  magik: number;
  rank: number;
  nextFightTimeMin?: Date;
  user: User;
  fights: Fight[];

  constructor(dto: CharacterDto) {
    Object.assign(this, dto);
  }

  isFree(): boolean {
    return this.nextFightTimeMin === null || this.nextFightTimeMin <= new Date();
  }

}
