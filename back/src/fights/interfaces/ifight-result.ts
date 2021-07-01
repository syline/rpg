import { Character } from "../../characters/entities/character.entity";

export interface IFightResult {
  winner: Character;
  looser: Character;
}