import { HttpStatus, INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UsersServiceProvider } from '../users/users.module';
import * as request from 'supertest';
import { SqliteErrorsEnum } from '../enums/sqlite-errors.enum';
import { User } from '../users/entities/user.entity';
import { userRepositoryMock } from '../users/mocks/user.repository.mock';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationServiceProviders } from './authentication.module';
import { jwtServiceMock } from './mocks/jwt.service.mock';
import { LocalStrategy } from './strategies/local.strategy';

describe('Given AuthenticationController', () => {
  let app: INestApplication;

  const createUserData = {
    login: 'test',
    password: 'test',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        AuthenticationServiceProviders,
        UsersServiceProvider,
        LocalStrategy,
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        }
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    jest.mock('bcrypt');
  });

  describe('When register a new user with valid data', () => {
    let response;
    beforeEach(async () => {
      userRepositoryMock.save.mockReturnValue(Promise.resolve(createUserData));
      response = await request(app.getHttpServer())
      .post('/authentication/register')
      .send(createUserData);
    });

    it('Then response status code = 201', () => {
      expect(response.statusCode).toEqual(HttpStatus.CREATED);
    });

    it('Then it should respond with user\'s data without the password', () => {
      expect(response.body).toEqual({ login: createUserData.login });
    })
  })

  describe('When register a user with invalid data (login already exist)', () => {
    let response;

    beforeEach(async () => {
      userRepositoryMock.save.mockRejectedValue({ code: SqliteErrorsEnum.constraint });
      response = await request(app.getHttpServer())
      .post('/authentication/register')
      .send(createUserData);
    });

    it('Then it should throw an error', () => {
      expect(response.statusCode).toEqual(HttpStatus.CONFLICT);
    })
  })

  describe('When something get wrong during registering a user', () => {
    let response;
    
    beforeEach(async () => {
      userRepositoryMock.save.mockRejectedValue(new Error());

      response = await request(app.getHttpServer())
      .post('/authentication/register')
      .send(createUserData);
    });

    it('Then it should throw an error', () => {
      expect(response.statusCode).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    })
  })

  describe('When log in with valid user and password', () => {
    let response;

    beforeEach(async () => {
      const mockUserData = new User({ id: 1, login: 'test', password: 'test' });
      userRepositoryMock.findOne.mockReturnValue(Promise.resolve(mockUserData));
      (bcrypt.compare as jest.Mock) = jest.fn().mockReturnValue(true);
      jwtServiceMock.sign.mockReturnValue('');

      response = await request(app.getHttpServer())
      .post('/authentication/login')
      .send({ login: 'test', password: 'test' });
    });

    it('Then response status code = 200', () => {
      expect(response.statusCode).toEqual(HttpStatus.OK);
    });

    it('Then it should retreive access token', () => {
      expect(response.body).toEqual({ id: 1, login: 'test', accessToken: '' });
    });
  })
});
