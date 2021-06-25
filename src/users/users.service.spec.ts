import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { userRepositoryMock } from './mocks/user.repository.mock';
import { UsersService } from './users.service';

describe('Given UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock,
        }
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(User));
  });

  describe('When service is called', () => {
    it('Then it should be defined', () => {
      expect(service).toBeDefined();
    });
  })

  describe('When create a user', () => {
    const createUserData = { login: 'test', password: 'test' };

    beforeEach(() => {
      service.create(createUserData);
    });

    it('Then repository.save should have been called', () => {
      expect(repository.save).toHaveBeenCalledWith(createUserData);
    });
  });

  describe('When get user by existing login', () => {
    const user = new User({ login: 'test' });
    let retreivedUser: User;

    beforeEach(async () => {
      userRepositoryMock.findOne.mockReturnValue(Promise.resolve(user));
      retreivedUser = await service.getByLogin('test');
    });

    it('Then user is retrieved', () => {
      expect(retreivedUser.login).toEqual(user.login);
    })
  })

  describe('When get user by unexisting login', () => {
    beforeEach(() => {
      userRepositoryMock.findOne.mockReturnValue(undefined);
    });

    it('Then an exception is thrown', async () => {
      await expect(service.getByLogin('test')).rejects.toThrow();
    })
  })
});
