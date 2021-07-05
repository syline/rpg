import { Injectable } from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { NB_CHARACTER_MAX } from '../constants/constant';
import { CharacteristicsEnum } from '../enums/characteristics.enum';
import { LevelUpError } from '../shared/errors/level-up.error';
import { MaxNbCharacterError } from '../shared/errors/max-nb-character.error';
import { CharactersRepository } from './characters.repository';
import { Character } from './entities/CHARACTER.entity';
import { ICharactersService } from './interfaces/iCHARACTERs.service';

@Injectable()
export class CharactersService implements ICharactersService {
  constructor(
    private charactersRepository: CharactersRepository,
  ) { }
  
  async create(name: string, userId: number): Promise<Character> {
    const characters = await this.findAllByUserId(userId);
    if (characters.length >= NB_CHARACTER_MAX) {
      throw new MaxNbCharacterError();
    }

    const character = new Character(name, userId);
    
    return this.charactersRepository.save(character);
  }

  async findAllByUserId(userId: number): Promise<Character[]> {
    return this.charactersRepository.getByUserId(userId);
  }

  async findOne(id: number): Promise<Character> {
    return this.charactersRepository.getById(id);
  }

  async update(id: number, character: Character): Promise<UpdateResult> {
    return this.charactersRepository.update(id, character);
  }

  async remove(id: number): Promise<DeleteResult> {
    return this.charactersRepository.delete(id);
  }

  async getOpponent(characterId: number): Promise<Character> {
    return this.charactersRepository.getOpponent(characterId);
  }

  async forwardSkillsToCharacter(
    characterId: number, 
    health: number, 
    defense: number, 
    attack: number, 
    magik: number,
  ): Promise<Character> {
    const character = await this.findOne(characterId);

    this.assignSkills(character, attack, CharacteristicsEnum.attack);
    this.assignSkills(character, defense, CharacteristicsEnum.defense);
    this.assignSkills(character, magik, CharacteristicsEnum.magik);
    this.assignHealth(character, health);
    
    if (character.skills < 0) {
      throw new LevelUpError();
    }

    return character;
  } 

  private assignSkills(
    characterToUpdate: Character, 
    skill: number,
    characteristic: CharacteristicsEnum,
  ): void {
    while(skill > 0) {
      let cost = Math.ceil(characterToUpdate[characteristic] / 5);
      
      if (cost === 0) {
        cost = 1;
      }

      characterToUpdate.skills -= cost;
      characterToUpdate[characteristic]++;
      skill--;
    }
  }

  private assignHealth(
    characterToUpdate: Character, 
    health: number, 
  ): void {
    characterToUpdate.skills -= health;
    characterToUpdate.health += health;
  }
}
