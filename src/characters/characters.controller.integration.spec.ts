import { INestApplication } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { JwtStrategy } from '../authentication/strategies/jwt.strategy';
import { JWT_SECRET } from '../constants/jwt.contant';
import { User } from '../users/entities/user.entity';
import { CharactersController } from './characters.controller';
import { CharactersService } from './characters.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { Character } from './entities/character.entity';
import { characterRepositoryMock } from './mocks/characters.repository.mock';

describe('Given CharactersController', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let accessToken: string;

  const createCharacterData = new CreateCharacterDto();
  createCharacterData.user = new User({ id: 1 });
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: JWT_SECRET,
          signOptions: { expiresIn: '1h' },
        }),
      ],
      controllers: [
        CharactersController,
      ],
      providers: [
        CharactersService,
        JwtStrategy,
        {
          provide: getRepositoryToken(Character),
          useValue: characterRepositoryMock,
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
      characterRepositoryMock.save.mockReturnValue(Promise.resolve(createCharacterData));
      response = await request(app.getHttpServer())
      .post('/characters')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(createCharacterData);      
    });

    it('Then response status code = 201', () => {
      expect(response.statusCode).toEqual(201);
    });

    it('Then it should retrieve added character', () => {
      expect(response.body).toEqual(createCharacterData); 
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
      expect(response.statusCode).toEqual(401);
    });
  });


  describe('When user is logged-in and search for a character by id that exists', () => {
    const character = new Character();
    character.id = 1;
    let response;

    beforeEach(async () => {
      characterRepositoryMock.findOne.mockReturnValue(Promise.resolve(character));
      response = await request(app.getHttpServer())
      .get('/characters/1')
      .set('Authorization', `Bearer ${accessToken}`);
    });

    it('Then response status code = 200', () => {
      expect(response.statusCode).toEqual(200);
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
      expect(response.statusCode).toEqual(401);
    });
  });


  describe('When user is logged-in and update a character', () => {
    let response;

    beforeEach(async () => {
      response = await request(app.getHttpServer())
      .patch('/characters/1')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(new UpdateCharacterDto());      
    });

    it('Then response status code = 200', () => {
      expect(response.statusCode).toEqual(200);
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
      expect(response.statusCode).toEqual(401);
    });
  });


  describe('When user is logged-in and remove a character', () => {
    let response;

    beforeEach(async () => {
      response = await request(app.getHttpServer())
      .delete('/characters/1')
      .set('Authorization', `Bearer ${accessToken}`);
    });

    it('Then response status code = 200', () => {
      expect(response.statusCode).toEqual(200);
    });
  });

  describe('When user is not logged-in and remove a character', () => {
    let response;

    beforeEach(async () => {
      response = await request(app.getHttpServer())
      .delete('/characters/1');
    });

    it('Then response status code = 401 (unauthorized)', () => {
      expect(response.statusCode).toEqual(401);
    });
  });
});
