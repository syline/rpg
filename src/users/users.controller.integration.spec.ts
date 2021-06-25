import { INestApplication } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { JwtStrategy } from '../authentication/strategies/jwt.strategy';
import { CharacterServiceProvider } from '../characters/characters.module';
import { Character } from '../characters/entities/character.entity';
import { characterRepositoryMock } from '../characters/mocks/characters.repository.mock';
import { JWT_SECRET } from '../constants/jwt.contant';
import { UsersController } from './users.controller';

describe('Given UsersController', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let accessToken: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: JWT_SECRET,
          signOptions: { expiresIn: '1h' },
        }),
      ],
      controllers: [UsersController],
      providers: [
        CharacterServiceProvider,
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

  describe('When user is logged-in and find user\'s characters', () => {
    let response;
    const characters = [new Character(), new Character(), new Character()];

    beforeEach(async () => {
      characterRepositoryMock.find.mockReturnValue(Promise.resolve(characters));
      response = await request(app.getHttpServer())
      .get('/users/1/characters')
      .set('Authorization', `Bearer ${accessToken}`);
    });

    it('Then response status code = 200', () => {
      expect(response.statusCode).toEqual(200);
    });

    it('Then it should retrieve all user\'s characters', () => {
      expect(response.body).toEqual(characters); 
    });
  });

  describe('When user is not logged-in and find user\'s characters', () => {
    let response;

    beforeEach(async () => {
      response = await request(app.getHttpServer())
      .get('/users/1/characters');     
    });

    it('Then response status code = 401 (unauthorized)', () => {
      expect(response.statusCode).toEqual(401);
    });
  });

});
