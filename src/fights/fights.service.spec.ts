import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IFIGHTS_SERVICE } from '../constants/services.constant';
import { Repository } from 'typeorm';
import { Fight } from './entities/fight.entity';
import { FightsServiceProvider } from './fights.module';
import { FightsService } from './fights.service';
import { fightsRepositoryMock } from './mocks/fights.repository.mock';

describe('Given FightsService', () => {
  let service: FightsService;
  let repository: Repository<Fight>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FightsServiceProvider,
        {
          provide: getRepositoryToken(Fight),
          useValue: fightsRepositoryMock,
        }
      ],
    }).compile();

    service = module.get<FightsService>(IFIGHTS_SERVICE);
    repository = module.get(getRepositoryToken(Fight));
  });

  describe('When service is called', () => {
    it('Then it should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('When find all character\'s fights', () => {
    beforeEach(() => {
      service.findAllByCharacterId(1);
    });

    it('Then repository.find is called with specific parameter', () => {
      expect(repository.find).toHaveBeenCalledWith({
        where: [
          { character1: { id: 1 }},
          { character2: { id: 1 }}
        ],
        relations: ['character1', 'character2']
      })
    });
  });
});
