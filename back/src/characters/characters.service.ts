import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CharacteristicsEnum } from '../enums/characteristics.enum';
import { LevelUpError } from '../shared/errors/level-up.error';
import { MaxNbCharacterError } from '../shared/errors/max-nb-character.error';
import { User } from '../users/entities/user.entity';
import { Character } from './entities/CHARACTER.entity';
import { getOpponentQuery } from './get-opponent-query';
import { ICharactersService } from './interfaces/iCHARACTERs.service';

@Injectable()
export class CharactersService implements ICharactersService {
  constructor(
    @InjectRepository(Character)
    private characterRepository: Repository<Character>,
  ) { }
  
  async create(name: string, userId: number): Promise<Character> {
    const characters = await this.findAllByUserId(userId);
    if (characters.length > 9) {
      throw new MaxNbCharacterError();
    }

    const character = new Character(name, userId);
    
    return await this.characterRepository.save(character);
  }

  async findAllByUserId(userId: number): Promise<Character[]> {
    const user = new User({ id: userId });
    return await this.characterRepository.find({ user });
  }

  async findOne(id: number): Promise<Character> {
    return await this.characterRepository.findOne({ id });
  }

  async update(id: number, character: Character): Promise<UpdateResult> {
    return await this.characterRepository.update(id, character);
  }

  async forwardSkillsToCharacter(
    characterId: number, 
    health: number, 
    defense: number, 
    attack: number, 
    magik: number,
  ): Promise<Character> {
    const character = await this.findOne(characterId);

    this.forwardSkills(character, attack, CharacteristicsEnum.attack);
    this.forwardSkills(character, defense, CharacteristicsEnum.defense);
    this.forwardSkills(character, magik, CharacteristicsEnum.magik);
    this.forwardHealth(character, health);
    
    if (character.skills < 0) {
      throw new LevelUpError();
    }

    return character;
  } 

  private forwardSkills(
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

  private forwardHealth(
    characterToUpdate: Character, 
    health: number, 
  ): void {
    characterToUpdate.skills -= health;
    characterToUpdate.health += health;

  }

  async remove(id: number) {
    return await this.characterRepository.delete(id);
  }

  async getOpponent(characterId: number): Promise<Character> {
    return await this.characterRepository.query(getOpponentQuery(characterId))
    .then((characters: Character[]) => {
      if (characters.length > 0) {
        return characters[0];
      }
    });
  }
}
