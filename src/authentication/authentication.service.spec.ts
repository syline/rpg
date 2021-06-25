import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { IAUTHENTICATION_SERVICE } from '../constants/services.constant';
import { User } from '../users/entities/user.entity';
import { usersServiceMock } from '../users/mocks/users.service.mock';
import { UsersService } from '../users/users.service';
import { AuthenticationService } from './authentication.service';
import { AccessTokenDto } from './dto/accessToken.dto';
import { jwtServiceMock } from './mocks/jwt.service.mock';

describe('Given AuthenticationService', () => {
  let service: AuthenticationService;
  const createUserData = { login: 'test', password: 'test' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: IAUTHENTICATION_SERVICE,
          useClass: AuthenticationService,
        },
        {
          provide: UsersService,
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
      createdUser = await service.register(createUserData);
    });

    it('Then new user is returned', () => {
      expect(createdUser).toBeDefined();
    });
  });

  describe('When register a user with an existing login', () => {
    beforeEach(() => {
      usersServiceMock.create.mockRejectedValue(new Error('toto'))
    });

    it('Then an exception is thrown', async () => {
      await expect(service.register(createUserData)).rejects.toThrow();
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
      await expect(service.getAuthenticatedUser('test', 'test')).rejects.toThrow();
    });
  });

  describe('When authenticate user with wrong password', () => {
    beforeEach(async () => {
      usersServiceMock.getByLogin.mockReturnValue(Promise.resolve(new User({ })));
      (bcrypt.compare as jest.Mock) = jest.fn().mockReturnValue(false);
    });

    it('Then an exception is thrown', async () => {
      await expect(service.getAuthenticatedUser('test', 'test')).rejects.toThrow();
    });
  });

  describe('When user log in', () => {
    let accessToken: AccessTokenDto;

    beforeEach(async () => {
      jwtServiceMock.sign.mockReturnValue({ accessToken: '' });
      accessToken = await service.login(new User({ }));
    });

    it('Then access token is retrieved', () => {
      expect(accessToken.accessToken).toBeDefined();
    });
  })
});
