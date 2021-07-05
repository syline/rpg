import { Test, TestingModule } from '@nestjs/testing';
import { IUSERS_SERVICE } from '../constants/services.constant';
import { CredentialsError } from '../errors/credentials.error';
import { User } from './entities/user.entity';
import { userRepositoryMock } from './mocks/user.repository.mock';
import { UsersServiceProvider } from './users.module';
import { UserRepository } from './users.repository';
import { UsersService } from './users.service';

describe('Given UsersService', () => {
  let service: UsersService;
  let repository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersServiceProvider,
        {
          provide: UserRepository,
          useValue: userRepositoryMock,
        }
      ],
    }).compile();

    service = module.get<UsersService>(IUSERS_SERVICE);
    repository = module.get<UserRepository>(UserRepository);
  });

  describe('When service is called', () => {
    it('Then it should be defined', () => {
      expect(service).toBeDefined();
    });
  })

  describe('When create a user', () => {
    const user = new User({ login: 'test', password: 'test' });

    beforeEach(() => {
      service.create(user);
    });

    it('Then repository.createUser should have been called', () => {
      expect(repository.createUser).toHaveBeenCalledWith(user);
    });
  });

  describe('When get user by existing login', () => {
    const user = new User({ login: 'test' });
    let retreivedUser: User;

    beforeEach(async () => {
      userRepositoryMock.getByLogin.mockReturnValue(Promise.resolve(user));
      retreivedUser = await service.getByLogin('test');
    });

    it('Then user is retrieved', () => {
      expect(retreivedUser.login).toEqual(user.login);
    })
  })

  describe('When get user by unexisting login', () => {
    beforeEach(() => {
      userRepositoryMock.getByLogin.mockRejectedValue(new CredentialsError());
    });

    it('Then an exception is thrown', async () => {
      await expect(service.getByLogin('test')).rejects.toThrowError(CredentialsError);
    })
  })
});
