import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async create(user: CreateUserDto): Promise<User> {
    return await this.userRepository.save(user);
  }

  async getByLogin(login: string): Promise<User> {
    const user = await this.userRepository.findOne({ login });
    if (user) {
      return user;
    }
    throw new HttpException('User with this login does not exist', HttpStatus.NOT_FOUND);
  }
}
