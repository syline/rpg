import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CharactersService } from './characters.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { Character } from './entities/character.entity';
import { characterRepositoryMock } from './mocks/characters.repository.mock';

describe('Given CharactersService', () => {
  let service: CharactersService;
  let repository: Repository<Character>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CharactersService,
        {
          provide: getRepositoryToken(Character),
          useValue: characterRepositoryMock,
        }
      ],
    }).compile();

    service = module.get<CharactersService>(CharactersService);
    repository = module.get(getRepositoryToken(Character));
  });

  describe('When service is called', () => {
    it('Then it should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('When add a character', () => {
    const createCharacterData = new CreateCharacterDto();
    beforeEach(() => {
      service.create(createCharacterData);
    });

    it('Then repository.save should have been called', () => {
      expect(repository.save).toHaveBeenCalledWith(createCharacterData);
    });
  })

  describe('When get all characters by user id', () => {
    beforeEach(() => {
      service.findAllByUserId(1);
    });

    it('Then repository.find should have been called with userId', () => {
      expect(repository.find).toHaveBeenCalledWith({ user: { id: 1 }});
    });
  })

  describe('When find a character by id', () => {
    beforeEach(() => {
      service.findOne(1);
    });

    it('Then repository.find should have been called with character\'s id', () => {
      expect(repository.findOne).toHaveBeenCalledWith({ id: 1 });
    });
  })

  describe('When update a character', () => {
    const updateCharacterData = new UpdateCharacterDto()
    beforeEach(() => {
      service.update(1, updateCharacterData);
    });

    it('Then repository.update should have been called with character\'s info', () => {
      expect(repository.update).toHaveBeenCalledWith(1, updateCharacterData);
    });
  })

  describe('When remove a character', () => {
    beforeEach(() => {
      service.remove(1);
    });

    it('Then repository.delete should have been called with character\'s id', () => {
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  })
});
