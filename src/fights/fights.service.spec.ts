import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { charactersServiceMock } from '../characters/mocks/characters.service.mock';
import { Repository } from 'typeorm';
import { Character } from '../characters/entities/character.entity';
import { ICharactersService } from '../characters/interfaces/icharacters.service';
import { characterRepositoryMock } from '../characters/mocks/characters.repository.mock';
import { ICHARACTERS_SERVICE, IFIGHTS_SERVICE } from '../constants/services.constant';
import { Fight } from './entities/fight.entity';
import { FightsServiceProvider } from './fights.module';
import { IFightsService } from './interfaces/ifights.service';
import { IRound } from './interfaces/iround';
import { fightsRepositoryMock } from './mocks/fights.repository.mock';

describe('Given FightsService', () => {
  let service: IFightsService;
  let repository: Repository<Fight>;
  let charactersService: ICharactersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FightsServiceProvider,
        {
          provide: ICHARACTERS_SERVICE,
          useValue: charactersServiceMock,
        },
        {
          provide: getRepositoryToken(Fight),
          useValue: fightsRepositoryMock,
        },
        {
          provide: getRepositoryToken(Character),
          useValue: characterRepositoryMock,
        }
      ],
    }).compile();

    service = module.get<IFightsService>(IFIGHTS_SERVICE);
    charactersService = module.get<ICharactersService>(ICHARACTERS_SERVICE);

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

  describe(`
    When challenger 1 (health = 12, attack = 10, defense = 3, magik = 4)
    fight with challenger 2 (health = 12, attack = 8, defense = 4, magik = 3)
    `, () => {
      const character1 = new Character();
      character1.health = 12;
      character1.attack = 10;
      character1.defense = 3;
      character1.magik = 4;

      const character2 = new Character();
      character2.health = 12;
      character2.attack = 8;
      character2.defense = 4;
      character2.magik = 3;

      let rounds: IRound[];
      beforeAll(async () => {
        charactersServiceMock.findOne.mockImplementation((id) => {
          if (id === 1) {
            return Promise.resolve(character1);
          }
          return Promise.resolve(character2);
        });
        rounds = await service.fights({ character1Id: 1, character2Id: 2 });
      });

      it('Then charactersService.update is called twice', () => {
        expect(charactersService.update).toHaveBeenCalledTimes(2);
      });

      it('Then fightRepository.save have been called', () => {
        expect(fightsRepositoryMock.save).toHaveBeenCalled();
      });
      
      it('Then we have all rounds passed', () => {
        expect(rounds.length).toBeGreaterThan(0);
      });

      it('Then fight stop when one character is dead', () => {
        let health1 = 12;
        let health2 = 12;

        let i = 0;
        while (health1 > 0 && health2 > 0) {
          health1 -= rounds[i].character1DamagesReceived;
          health2 -= rounds[i].character2DamagesReceived;
          i++;
        }

        expect(i).toEqual(rounds.length);
      });
  });
});
