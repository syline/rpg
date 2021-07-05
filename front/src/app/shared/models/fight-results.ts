import { FightResultsDto } from "../dto/fight-results.dto";
import { Character } from "./character";
import { Round } from "./round";

export class FightResults {
  winner: Character;
  looser: Character;
  rounds: Round[];

  constructor(fightResultsDto: FightResultsDto) {
    Object.assign(this, fightResultsDto);
  }
}
