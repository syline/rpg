import { UpdateResult } from "typeorm";
import { UpdateCharacterDto } from "../dto/update-character.dto";
import { Character } from "../entities/character.entity";

export interface ICharactersService {
  create(name: string, userId: number): Promise<Character>;

  findAllByUserId(userId: number): Promise<Character[]>;

  findOne(id: number): Promise<Character>;

  getOpponent(characterId: number): Promise<Character>;

  update(id: number, updateCharacterDto: UpdateCharacterDto): Promise<UpdateResult>;

  forwardSkillsToCharacter(characterId: number, updateCharacterDto: UpdateCharacterDto): Promise<Character>;

  remove(id: number);
}