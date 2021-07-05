import { Test, TestingModule } from '@nestjs/testing';
import { ICHARACTERS_SERVICE } from '../constants/services.constant';
import { MaxNbCharacterError } from '../errors/max-nb-character.error';
import { User } from '../users/entities/user.entity';
import { CharacterServiceProvider } from './characters.module';
import { CharactersRepository } from './characters.repository';
import { CharactersService } from './characters.service';
import { Character } from './entities/character.entity';
import { characterRepositoryMock } from './mocks/characters.repository.mock';

describe('Given CharactersService', () => {
  let service: CharactersService;
  let repository: CharactersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CharacterServiceProvider,
        {
          provide: CharactersRepository,
          useValue: characterRepositoryMock,
        }
      ],
    }).compile();

    service = module.get<CharactersService>(ICHARACTERS_SERVICE);
    repository = module.get<CharactersRepository>(CharactersRepository);
  });

  describe('When service is called', () => {
    it('Then it should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('When add a character', () => {
    beforeEach(() => {
      characterRepositoryMock.getByUserId.mockReturnValue(Promise.resolve([]));
      service.create('name', 1);
    });

    it('Then repository.save should have been called', () => {
      const character = new Character();
      character.name = 'name';
      character.user = new User({ id: 1 });
      expect(repository.save).toHaveBeenCalledWith(character);
    });
  })

  describe('When add a character and already have 10 characters', () => {
    beforeEach(() => {
      const characters = [];
      for (let i = 0; i < 10; i++) {
        characters.push(new Character());
      }
      characterRepositoryMock.getByUserId.mockReturnValue(Promise.resolve(characters));
    });

    it('Then repository.save should throw an error', () => {
      expect(service.create('name', 1)).rejects.toThrow(MaxNbCharacterError);
    });
  })

  describe('When get all characters by user id', () => {
    beforeEach(() => {
      service.findAllByUserId(1);
    });

    it('Then repository.find should have been called with userId', () => {
      expect(repository.getByUserId).toHaveBeenCalledWith(1);
    });
  })

  describe('When find a character by id', () => {
    beforeEach(() => {
      service.findOne(1);
    });

    it('Then repository.find should have been called with character\'s id', () => {
      expect(repository.getById).toHaveBeenCalledWith(1);
    });
  })

  describe('When update a character', () => {
    const character = new Character();
    character.id = 1;

    beforeEach(() => {
      service.update(character);
    });

    it('Then repository.update should have been called with character\'s info', () => {
      expect(repository.update).toHaveBeenCalledWith(character.id, character);
    });
  })

  describe(`
    When a character has attack (0), defense (0), magik (0), health (10) 
    and has 12 skill points 
    and level up for 12 health points`,
    () => {
      let updatedCharacter: Character;

      beforeEach(async () => {
        characterRepositoryMock.getById.mockReturnValue(Promise.resolve(new Character()));
        updatedCharacter = await service.forwardSkillsToCharacter(1, 12, 0, 0, 0);
      });

      it('Then updated character should have 0 attack', () => {
        expect(updatedCharacter.attack).toEqual(0);
      });

      it('Then updated character should have 0 defense', () => {
        expect(updatedCharacter.defense).toEqual(0);
      });

      it('Then updated character should have 0 magik', () => {
        expect(updatedCharacter.magik).toEqual(0);
      });

      it('Then updated character should have 22 health', () => {
        expect(updatedCharacter.health).toEqual(22);
      });

      it('Then updated character should have 0 skill', () => {
        expect(updatedCharacter.skills).toEqual(0);
      });
    },
  );

  describe(`
    When a character has attack (0), defense (0), magik (0), health (10) 
    and has 12 skill points 
    and level up for 13 health points`,
    () => {
      beforeEach(async () => {
        characterRepositoryMock.getById.mockReturnValue(Promise.resolve(new Character()));
      });

      it('Then an error is thrown', async () => {
        await expect(service.forwardSkillsToCharacter(1, 13, 0, 0, 0)).rejects.toThrow();
      });
    },
  );

  describe(`
    When a character has attack (0), defense (0), magik (0), health (10) 
    and has 12 skill points 
    and level up for 9 defense points`,
    () => {
      let updatedCharacter: Character;

      beforeEach(async () => {
        characterRepositoryMock.getById.mockReturnValue(Promise.resolve(new Character()));
        updatedCharacter = await service.forwardSkillsToCharacter(1, 0, 9, 0, 0);
      });

      it('Then updated character should have 0 attack', () => {
        expect(updatedCharacter.attack).toEqual(0);
      });

      it('Then updated character should have 9 defense', () => {
        expect(updatedCharacter.defense).toEqual(9);
      });

      it('Then updated character should have 0 magik', () => {
        expect(updatedCharacter.magik).toEqual(0);
      });

      it('Then updated character should have 10 health', () => {
        expect(updatedCharacter.health).toEqual(10);
      });

      it('Then updated character should have 0 skill', () => {
        expect(updatedCharacter.skills).toEqual(0);
      });
    },
  );

  describe('When remove a character', () => {
    beforeEach(() => {
      service.remove(1);
    });

    it('Then repository.delete should have been called with character\'s id', () => {
      expect(repository.update).toHaveBeenCalledWith(1, { deleted: true });
    });
  })
});
