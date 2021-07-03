import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateCharacterDto } from './dto/create-CHARACTER.dto';
import { UpdateCharacterDto } from './dto/update-CHARACTER.dto';
import { Character } from './entities/CHARACTER.entity';
import { ICharactersService } from './interfaces/iCHARACTERs.service';
import { getOpponentQuery } from './get-opponent-query';
import { MaxNbCharacterError } from 'src/shared/errors/max-nb-character.error';
import { LevelUpError } from 'src/shared/errors/level-up.error';
import { CharacteristicsEnum } from 'src/enums/characteristics.enum';

@Injectable()
export class CharactersService implements ICharactersService {
  constructor(
    @InjectRepository(Character)
    private characterRepository: Repository<Character>,
  ) { }
  
  async create(createCharacterDto: CreateCharacterDto): Promise<Character> {
    const characters = await this.findAllByUserId(createCharacterDto.userId);
    if (characters.length > 9) {
      throw new MaxNbCharacterError();
    }

    const character = new Character();
    character.name = createCharacterDto.name;
    character.user = new User({ id: createCharacterDto.userId });
    
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

  async forwardSkillsToCharacter(characterId: number, updateCharacterDto: UpdateCharacterDto): Promise<Character> {
    const character = await this.findOne(characterId);

    this.forwardSkills(character, updateCharacterDto, CharacteristicsEnum.attack);
    this.forwardSkills(character, updateCharacterDto, CharacteristicsEnum.defense);
    this.forwardSkills(character, updateCharacterDto, CharacteristicsEnum.magik);
    this.forwardHealth(character, updateCharacterDto);
    
    if (character.skills < 0) {
      throw new LevelUpError();
    }

    return character;
  } 

  private forwardSkills(
    characterToUpdate: Character, 
    updateCharacterDto: UpdateCharacterDto, 
    characteristic: CharacteristicsEnum,
  ): void {
    while(updateCharacterDto[characteristic] > 0) {
      const cost = Math.ceil(characterToUpdate[characteristic] / 5);
      characterToUpdate.skills -= cost;
      characterToUpdate[characteristic]++;
      updateCharacterDto[characteristic]--;
    }
  }

  private forwardHealth(
    characterToUpdate: Character, 
    updateCharacterDto: UpdateCharacterDto, 
  ): void {
    characterToUpdate.skills -= updateCharacterDto.health;
    characterToUpdate.health += updateCharacterDto.health;
  }

  async remove(id: number) {
    return await this.characterRepository.delete(id);
  }

  async getOpponent(characterId: number): Promise<Character> {
    return await this.characterRepository.query(getOpponentQuery(characterId));
  }
}
