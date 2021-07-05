import { Test, TestingModule } from '@nestjs/testing';
import { CharactersRepository } from '../characters/characters.repository';
import { Character } from '../characters/entities/character.entity';
import { characterRepositoryMock } from '../characters/mocks/characters.repository.mock';
import { charactersServiceMock } from '../characters/mocks/characters.service.mock';
import { ICHARACTERS_SERVICE, IFIGHTS_SERVICE } from '../constants/services.constant';
import { NoFightError } from '../shared/errors/no-fight.error';
import { FightsServiceProvider } from './fights.module';
import { FightsRepository } from './fights.repository';
import { IFightsService } from './interfaces/ifights.service';
import { IRound } from './interfaces/iround';
import { fightsRepositoryMock } from './mocks/fights.repository.mock';
import { Fighter } from './models/fighter';

describe('Given FightsService', () => {
  let service: IFightsService;
  let repository: FightsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FightsServiceProvider,
        {
          provide: ICHARACTERS_SERVICE,
          useValue: charactersServiceMock,
        },
        {
          provide: FightsRepository,
          useValue: fightsRepositoryMock,
        },
        {
          provide: CharactersRepository,
          useValue: characterRepositoryMock,
        }
      ],
    }).compile();

    service = module.get<IFightsService>(IFIGHTS_SERVICE);
    repository = module.get(FightsRepository);
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
      expect(repository.getFightsByCharacterId).toHaveBeenCalledWith(1);
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
      rounds = await service.fight(1, 2);
    });

    it('Then fightRepository.saveFightResults have been called', () => {
      expect(fightsRepositoryMock.saveFightResults).toHaveBeenCalled();
    });

    it('Then we have all rounds passed', () => {
      expect(rounds.length).toBeGreaterThan(0);
    });

    it('Then fight stop when one character is dead', () => {
      const fighterA = new Fighter(attacker);
      const fighterB = new Fighter(defender);

      let i = 0;
      while (fighterA.isAlive() && fighterB.isAlive()) {
        fighterA.health -= rounds[i].attackerDamagesReceived;
        fighterB.health -= rounds[i].defenderDamagesReceived;
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

    beforeEach(() => {
      charactersServiceMock.findOne.mockImplementation((id) => {
        if (id === 1) {
          return Promise.resolve(attacker);
        }
        return Promise.resolve(defender);
      });     
    });

    it('Then fight throw an error', async() => {
      await expect(service.fight(1, 2)).rejects.toThrowError(NoFightError);
    });
  });
});
