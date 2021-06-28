import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fight } from './entities/fight.entity';
import { IFightsService } from './interfaces/ifights.service';

@Injectable()
export class FightsService implements IFightsService {
  constructor(
    @InjectRepository(Fight)
    private fightRepository: Repository<Fight>,
  ) { }

  async findAllByCharacterId(id: number): Promise<Fight[]> {
    return await this.fightRepository.find({
      where: [
        { character1: { id } },
        { character2: { id } }
      ],
      relations: ['character1', 'character2']
    })
  }
}
