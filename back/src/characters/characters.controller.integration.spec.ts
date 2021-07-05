import { HttpStatus, INestApplication } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { FightsRepository } from '../fights/fights.repository';
import { Fighter } from '../fights/models/fighter';
import * as request from 'supertest';
import { JwtStrategy } from '../authentication/strategies/jwt.strategy';
import { JWT_SECRET, TOKEN_DURATION } from '../constants/jwt.contant';
import { Fight } from '../fights/entities/fight.entity';
import { FightsServiceProvider } from '../fights/fights.module';
import { fightsRepositoryMock } from '../fights/mocks/fights.repository.mock';
import { NoOpponentError } from '../shared/errors/no-opponent.error';
import { CharactersController } from './characters.controller';
import { CharacterServiceProvider } from './characters.module';
import { CharactersRepository } from './characters.repository';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { Character } from './entities/character.entity';
import { characterRepositoryMock } from './mocks/characters.repository.mock';

describe('Given CharactersController', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let accessToken: string;

  const createCharacterData = new CreateCharacterDto();
  createCharacterData.name = 'test';
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: JWT_SECRET,
          signOptions: { expiresIn: TOKEN_DURATION },
        }),
      ],
      controllers: [
        CharactersController,
      ],
      providers: [
        JwtStrategy,
        CharacterServiceProvider,
        FightsServiceProvider,
        {
          provide: CharactersRepository,
          useValue: characterRepositoryMock,
        },
        {
          provide: FightsRepository,
          useValue: fightsRepositoryMock,
        }
      ],
    }).compile();

    app = module.createNestApplication();
    jwtService = module.get(JwtService);
    await app.init();

    accessToken = jwtService.sign({ username: 'test', sub: 1 });
  });

  describe('When user is logged-in and create a character', () => {
    let response;

    beforeEach(async () => {
      characterRepositoryMock.getByUserId.mockReturnValue(Promise.resolve([]));
      characterRepositoryMock.save.mockReturnValue(Promise.resolve(new Character()));
      response = await request(app.getHttpServer())
      .post('/characters')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(createCharacterData);      
    });

    it('Then response status code = 201', () => {
      expect(response.statusCode).toEqual(HttpStatus.CREATED);
    });

    it('Then it should retrieve added character', () => {
      expect(response.body).toEqual(new Character()); 
    });
  });

  describe(`
    When user is logged-in 
    and create a character
    and has already 10 characters
    `, () => {
    let response;

    beforeEach(async () => {
      const characters = [];
      for (let i = 0; i < 10; i++) {
        characters.push(new Character());
      }
      characterRepositoryMock.getByUserId.mockReturnValue(Promise.resolve(characters));
      characterRepositoryMock.save.mockReturnValue(Promise.resolve(new Character()));
      response = await request(app.getHttpServer())
      .post('/characters')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(createCharacterData);      
    });

    it('Then response status code = 406', () => {
      expect(response.statusCode).toEqual(HttpStatus.NOT_ACCEPTABLE);
    });
  });

  describe('When user is not logged-in and create a character', () => {
    let response;

    beforeEach(async () => {
      response = await request(app.getHttpServer())
      .post('/characters')
      .send(createCharacterData);      
    });

    it('Then response status code = 401 (unauthorized)', () => {
      expect(response.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
    });
  });


  describe('When user is logged-in and search for a character by id that exists', () => {
    const character = new Character();
    character.id = 1;
    let response;

    beforeEach(async () => {
      characterRepositoryMock.getById.mockReturnValue(Promise.resolve(character));
      response = await request(app.getHttpServer())
      .get('/characters/1')
      .set('Authorization', `Bearer ${accessToken}`);
    });

    it('Then response status code = 200', () => {
      expect(response.statusCode).toEqual(HttpStatus.OK);
    });

    it('Then it should retrieve found character', () => {
      expect(response.body).toEqual(character); 
    });
  });

  describe('When user is not logged-in and search for a character by id', () => {
    const character = new Character();
    character.id = 1;
    let response;

    beforeEach(async () => {
      response = await request(app.getHttpServer())
      .get('/characters/1');
    });

    it('Then response status code = 401 (unauthorized)', () => {
      expect(response.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
    });
  });


  describe('When user is logged-in and update a character', () => {
    let response;

    beforeEach(async () => {
      characterRepositoryMock.getById.mockReturnValue(Promise.resolve(new Character()));

      response = await request(app.getHttpServer())
      .patch('/characters/1')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(new UpdateCharacterDto());      
    });

    it('Then response status code = 200', () => {
      expect(response.statusCode).toEqual(HttpStatus.OK);
    });
  });

  describe('When user is logged-in and update a character with fake characteristics', () => {
    let response;

    beforeEach(async () => {
      characterRepositoryMock.getById.mockReturnValue(Promise.resolve(new Character()));

      const updateCharacter = new UpdateCharacterDto();
      updateCharacter.attack = 12;
      updateCharacter.magik = 12;
      updateCharacter.defense = 12;
      updateCharacter.health = 12;

      response = await request(app.getHttpServer())
      .patch('/characters/1')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(updateCharacter);      
    });

    it('Then response status code = 406', () => {
      expect(response.statusCode).toEqual(HttpStatus.NOT_ACCEPTABLE);
    });
  });

  describe('When user is not logged-in and update a character', () => {
    let response;

    beforeEach(async () => {
      response = await request(app.getHttpServer())
      .patch('/characters/1')
      .send(new UpdateCharacterDto());      
    });

    it('Then response status code = 401 (unauthorized)', () => {
      expect(response.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
    });
  });


  describe('When user is logged-in and remove a character', () => {
    let response;

    beforeEach(async () => {
      characterRepositoryMock.delete.mockReturnValue(Promise.resolve(null));
      
      response = await request(app.getHttpServer())
      .delete('/characters/1')
      .set('Authorization', `Bearer ${accessToken}`);
    });

    it('Then response status code = 200', () => {
      expect(response.statusCode).toEqual(HttpStatus.OK);
    });
  });

  describe('When user is not logged-in and remove a character', () => {
    let response;

    beforeEach(async () => {
      response = await request(app.getHttpServer())
      .delete('/characters/1');
    });

    it('Then response status code = 401 (unauthorized)', () => {
      expect(response.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
    });
  });

  describe(`
    When user is logged-in 
    and search for a character for a fight 
    and there is someone free to fight
  `, () => {
    let response;
    const character = new Character();

    beforeEach(async () => {
      characterRepositoryMock.getOpponent.mockReturnValue(Promise.resolve(character))
      response = await request(app.getHttpServer())
      .get('/characters/1/opponent')
      .set('Authorization', `Bearer ${accessToken}`);
    });

    it('Then response status code = 200', () => {
      expect(response.statusCode).toEqual(HttpStatus.OK);
    });

    it('Then it should retrieve an opponent', () => {
      expect(response.body).toEqual(character); 
    });
  });

  describe(`
    When user is logged-in 
    and search for a character for a fight 
    and there is nobody free to fight
  `, () => {
    let response;

    beforeEach(async () => {
      characterRepositoryMock.getOpponent.mockRejectedValue(new NoOpponentError());
      response = await request(app.getHttpServer())
      .get('/characters/1/opponent')
      .set('Authorization', `Bearer ${accessToken}`);
    });

    it('Then response status code = 404', () => {
      expect(response.statusCode).toEqual(HttpStatus.NOT_FOUND);
    });
  });

  describe('When user is not logged-in and search for a character for a fight', () => {
    let response;

    beforeEach(async () => {
      response = await request(app.getHttpServer())
      .get('/characters/1/opponent');
    });

    it('Then response status code = 401 (unauthorized)', () => {
      expect(response.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('When user is logged-in and get character`s fights', () => {
    let response;
    const fights = [new Fight(new Fighter({ } as Character), new Fighter({ } as Character), 1)];
    beforeEach(async () => {
      fightsRepositoryMock.getFightsByCharacterId.mockReturnValue(Promise.resolve(fights));
      response = await request(app.getHttpServer())
      .get('/characters/1/fights')
      .set('Authorization', `Bearer ${accessToken}`);
    });

    it('Then response status = 200', () => {
      expect(response.statusCode).toEqual(HttpStatus.OK);
    })

    it('Then it should retreive all fights', () => {
      expect(response.body).toEqual(fights);
    });
  });

  describe('When user is not logged-in and search for a character\'s fight', () => {
    let response;

    beforeEach(async () => {
      response = await request(app.getHttpServer())
      .get('/characters/1/fights');
    });

    it('Then response status code = 401 (unauthorized)', () => {
      expect(response.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
    });
  });
});
