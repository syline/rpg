import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { IUsersService } from './interfaces/iuser.service';
import { UserRepository } from './users.repository';

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    private userRepository: UserRepository,
  ) { }

  async create(user: User): Promise<User> {
    return this.userRepository.createUser(user);
  }

  async getByLogin(login: string): Promise<User> {
    return this.userRepository.getByLogin(login);
  }
}
