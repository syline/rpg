import { UpdateResult } from "typeorm";
import { CreateCharacterDto } from "../dto/create-character.dto";
import { UpdateCharacterDto } from "../dto/update-character.dto";
import { Character } from "../entities/character.entity";

export interface ICharactersService {
  create(createCharacterDto: CreateCharacterDto): Promise<Character>;

  findAllByUserId(userId: number): Promise<Character[]>;

  findOne(id: number): Promise<Character>;

  getOpponent(characterId: number): Promise<Character>;

  update(id: number, updateCharacterDto: UpdateCharacterDto): Promise<UpdateResult>;

  remove(id: number);
}