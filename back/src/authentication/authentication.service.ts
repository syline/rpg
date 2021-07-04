import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CredentialsError } from '../shared/errors/credentials.error';
import { LoginAlreadyExistError } from '../shared/errors/login-already-exist.error';
import { IUSERS_SERVICE } from '../constants/services.constant';
import { SqliteErrorsEnum } from '../enums/sqlite-errors.enum';
import { User } from '../users/entities/user.entity';
import { IUsersService } from '../users/interfaces/iuser.service';
import { UserDto } from './dto/user.dto';
import { IAuthenticationService } from './interfaces/iauthentication.service';

@Injectable()
export class AuthenticationService implements IAuthenticationService {
  constructor(
    @Inject(IUSERS_SERVICE) private usersService: IUsersService,
    private jwtService: JwtService,
  ) { }

  async register(login: string, plainTextPassword: string): Promise<User> {
    try {
      const password = await bcrypt.hash(plainTextPassword, 10);
      const createdUser = await this.usersService.create(new User({ login, password }));

      return new User(createdUser);
    } catch (error) {
      if (error?.code === SqliteErrorsEnum.constraint) {
        throw new LoginAlreadyExistError();
      }
      throw error;
    }
  }

  async getAuthenticatedUser(login: string, plainTextPassword: string): Promise<User> {
    try {
      const user = await this.usersService.getByLogin(login);
      await this.checkPassword(plainTextPassword, user.password);

      return new User(user);
    } catch (error) {
      throw new CredentialsError();
    }
  }
   
  private async checkPassword(plainTextPassword: string, hashedPassword: string): Promise<void> {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword
    );
    if (!isPasswordMatching) {
      throw new CredentialsError();
    }
  }

  async login(user: User): Promise<UserDto> {
    const payload = { username: user.login, sub: user.id };
    return {
      id: user.id,
      login: user.login,
      accessToken: this.jwtService.sign(payload),
    };
  }
}
