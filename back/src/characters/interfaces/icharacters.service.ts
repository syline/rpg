import { Fighter } from "../../fights/models/fighter";
import { UpdateResult } from "typeorm";
import { Character } from "../entities/character.entity";

export interface ICharactersService {
  create(name: string, userId: number): Promise<Character>;

  findAllByUserId(userId: number): Promise<Character[]>;

  findOne(id: number): Promise<Character>;

  getOpponent(characterId: number): Promise<Character>;

  update(character: Character): Promise<UpdateResult>;

  forwardSkillsToCharacter(
    characterId: number,
    health: number, 
    defense: number, 
    attack: number, 
    magik: number,
  ): Promise<Character>;

  remove(id: number);

  getUpdatedWinner(winner: Fighter): Character;

  getUpdatedLooser(looser: Fighter): Character;
}