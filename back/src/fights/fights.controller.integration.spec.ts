import { INestApplication } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { JWT_SECRET } from '../constants/jwt.contant';
import { FightsController } from './fights.controller';
import { FightsServiceProvider } from './fights.module';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Fight } from './entities/fight.entity';
import { fightsRepositoryMock } from './mocks/fights.repository.mock';
import { CharacterServiceProvider } from '../characters/characters.module';
import { characterRepositoryMock } from '../characters/mocks/characters.repository.mock';
import { Character } from '../characters/entities/character.entity';
import { JwtStrategy } from '../authentication/strategies/jwt.strategy';

describe('Given FightsController', () => {
  let app: INestApplication;
  let accessToken;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: JWT_SECRET,
          signOptions: { expiresIn: '1h' },
        }),
      ],
      controllers: [
        FightsController,
      ],
      providers: [
        JwtStrategy,
        FightsServiceProvider,
        CharacterServiceProvider,
        {
          provide: getRepositoryToken(Fight),
          useValue: fightsRepositoryMock,
        },
        {
          provide: getRepositoryToken(Character),
          useValue: characterRepositoryMock,
        }
      ]
    }).compile();

    app = module.createNestApplication();
    jwtService = module.get(JwtService);
    await app.init();

    accessToken = jwtService.sign({ username: 'test', sub: 1 });
  });

  describe('When user is logged-in and launch a fight between characters 1 and 2', () => {
    let response;

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

    beforeEach(async () => {
      characterRepositoryMock.findOne.mockImplementation((id) => {
        if (id === 1) {
          return Promise.resolve(character1);
        }
        return Promise.resolve(character2);
      });

      response = await request(app.getHttpServer())
      .post('/fights')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ character1Id: 1, character2Id: 2 });      
    });

    it('Then response status code = 201', () => {
      expect(response.statusCode).toEqual(201);
    });

    it('Then it should retrieve fights rounds', () => {
      expect(response.body.length).toBeGreaterThan(0);
    });
  });
});
