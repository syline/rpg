import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateCharacterDto } from './dto/create-CHARACTER.dto';
import { UpdateCharacterDto } from './dto/update-CHARACTER.dto';
import { Character } from './entities/CHARACTER.entity';
import { ICharactersService } from './interfaces/iCHARACTERs.service';
import { getOpponentQuery } from './get-opponent-query';

@Injectable()
export class CharactersService implements ICharactersService {
  constructor(
    @InjectRepository(Character)
    private characterRepository: Repository<Character>,
  ) { }
  
  async create(createCharacterDto: CreateCharacterDto): Promise<Character> {
    return await this.characterRepository.save(createCharacterDto);
  }

  async findAllByUserId(userId: number): Promise<Character[]> {
    const user = new User({ id: userId });
    return await this.characterRepository.find({ user });
  }

  async findOne(id: number): Promise<Character> {
    return await this.characterRepository.findOne({ id });
  }

  async update(id: number, updateCharacterDto: UpdateCharacterDto): Promise<UpdateResult> {
    return await this.characterRepository.update(id, updateCharacterDto);
  }

  async remove(id: number) {
    return await this.characterRepository.delete(id);
  }

  async getOpponent(characterId: number): Promise<Character> {
    return await this.characterRepository.query(getOpponentQuery(characterId));
  }
}
