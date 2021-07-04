import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { IAUTHENTICATION_SERVICE, IUSERS_SERVICE } from '../constants/services.constant';
import { SqliteErrorsEnum } from '../enums/sqlite-errors.enum';
import { usersServiceMock } from '../users/mocks/users.service.mock';
import { AuthenticationServiceProviders } from './authentication.module';
import { AuthenticationService } from './authentication.service';
import { UserDto } from './dto/user.dto';
import { jwtServiceMock } from './mocks/jwt.service.mock';
import { LoginAlreadyExistError } from '../shared/errors/login-already-exist.error';
import { CredentialsError } from '../shared/errors/credentials.error';

describe('Given AuthenticationService', () => {
  let service: AuthenticationService;
  const createUserData = { login: 'test', password: 'test' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationServiceProviders,
        {
          provide: IUSERS_SERVICE,
          useValue: usersServiceMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    service = module.get<AuthenticationService>(IAUTHENTICATION_SERVICE);
    
    jest.mock('bcrypt');
  });

  describe('When service is launched', () => {
    it('Then it should be defined', () => {
      expect(service).toBeDefined();
    });
  })

  describe('When register a new user', () => {
    const user = new User({ login: createUserData.login });
    let createdUser: User;

    beforeEach(async () => {
      usersServiceMock.create.mockReturnValue(Promise.resolve(user));
      createdUser = await service.register(createUserData.login, createUserData.password);
    });

    it('Then new user is returned', () => {
      expect(createdUser).toBeDefined();
    });
  });

  describe('When register a user with an existing login', () => {
    beforeEach(() => {
      usersServiceMock.create.mockRejectedValue({ code: SqliteErrorsEnum.constraint });
    });

    it('Then an exception is thrown', async () => {
      await expect(() => service.register(createUserData.login, createUserData.password)).rejects.toThrow(LoginAlreadyExistError);
    });
  });

  describe('When authenticate user with right login and password', () => {
    let retrievedUser: User;

    beforeEach(async () => {
      usersServiceMock.getByLogin.mockReturnValue(Promise.resolve(new User({ })));
      (bcrypt.compare as jest.Mock) = jest.fn().mockReturnValue(true);
      retrievedUser = await service.getAuthenticatedUser('test', 'test');
    });

    it('Then user is retrieved', () => {
      expect(retrievedUser).toBeDefined();
    });
  });

  describe('When authenticate user with wrong login', () => {
    beforeEach(() => {
      usersServiceMock.getByLogin.mockRejectedValue(new Error());
    });

    it('Then an exception is thrown', async () => {
      await expect(service.getAuthenticatedUser('test', 'test')).rejects.toThrow(CredentialsError);
    });
  });

  describe('When authenticate user with wrong password', () => {
    beforeEach(async () => {
      usersServiceMock.getByLogin.mockReturnValue(Promise.resolve(new User({ })));
      (bcrypt.compare as jest.Mock) = jest.fn().mockReturnValue(false);
    });

    it('Then an exception is thrown', async () => {
      await expect(service.getAuthenticatedUser('test', 'test')).rejects.toThrow(CredentialsError);
    });
  });

  describe('When user log in', () => {
    let user: UserDto;

    beforeEach(async () => {
      jwtServiceMock.sign.mockReturnValue('token');
      user = await service.login(new User({ id: 1, login: 'login', password: 'password' }));
    });

    it('Then a user is retrieved with id, login and access token', () => {
      expect(user).toEqual({
        id: 1,
        login: 'login',
        accessToken: 'token',
      })
    });
  })
});
