import { CharacterDto } from './character.dto';

export class FightDto {
  id: number;
  attacker: CharacterDto;
  defender: CharacterDto;
  winnerId: number;
}
