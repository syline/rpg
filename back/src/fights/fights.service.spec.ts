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
import { NoFightError } from '../shared/errors/no-fight.error';

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
          { attacker: { id: 1 } },
          { defender: { id: 1 } }
        ],
        relations: ['attacker', 'defender']
      })
    });
  });

  describe('When character 1 fight against character 2', () => {
    const attacker = new Character();
    attacker.health = 12;
    attacker.attack = 10;
    attacker.defense = 3;
    attacker.magik = 4;

    const defender = new Character();
    defender.health = 12;
    defender.attack = 8;
    defender.defense = 4;
    defender.magik = 3;

    let rounds: IRound[];
    beforeAll(async () => {
      charactersServiceMock.findOne.mockImplementation((id) => {
        if (id === 1) {
          return Promise.resolve(attacker);
        }
        return Promise.resolve(defender);
      });
      rounds = await service.fights(1, 2);
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
      let i = 0;
      while (attacker.isAlive() && defender.isAlive()) {
        attacker.health -= rounds[i].attackerDamagesReceived;
        defender.health -= rounds[i].defenderDamagesReceived;
        i++;
      }

      expect(i).toEqual(rounds.length);
    });
  });

  describe('When character 1 fight against character 2 and both are harmless', () => {
    const attacker = new Character();
    attacker.health = 12;
    attacker.attack = 0;
    attacker.defense = 3;
    attacker.magik = 4;

    const defender = new Character();
    defender.health = 12;
    defender.attack = 0;
    defender.defense = 4;
    defender.magik = 3;

    beforeAll(() => {
      charactersServiceMock.findOne.mockImplementation((id) => {
        if (id === 1) {
          return Promise.resolve(attacker);
        }
        return Promise.resolve(defender);
      });
     
    });

    it('Then fight throw an error', async() => {
      await expect(service.fights(1, 2)).rejects.toThrowError(NoFightError);
    });
  });
});
