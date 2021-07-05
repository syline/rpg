import { CharacterDto } from "./character.dto";
import { RoundDto } from "./round.dto";

export class FightResultsDto {
  winner: CharacterDto;
  looser: CharacterDto;
  rounds: RoundDto[];
}
