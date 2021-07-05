import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IUSERS_SERVICE } from '../constants/services.constant';
import { CredentialsError } from '../errors/credentials.error';
import { User } from '../users/entities/user.entity';
import { IUsersService } from '../users/interfaces/iuser.service';
import { UserTokenDto } from './dto/user-token.dto';
import { IAuthenticationService } from './interfaces/iauthentication.service';

@Injectable()
export class AuthenticationService implements IAuthenticationService {
  constructor(
    @Inject(IUSERS_SERVICE) private usersService: IUsersService,
    private jwtService: JwtService,
  ) { }

  async register(login: string, plainTextPassword: string): Promise<User> {
    const password = await bcrypt.hash(plainTextPassword, 10);
    const createdUser = await this.usersService.create(new User({ login, password }));

    return new User(createdUser);
  }

  async checkLoginPassword(login: string, plainTextPassword: string): Promise<User> {
    const user = await this.usersService.getByLogin(login);
    await this.checkPassword(plainTextPassword, user.password);

    return new User(user);
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

  async getAccessToken(user: User): Promise<UserTokenDto> {
    const payload = { username: user.login, sub: user.id };
    return new UserTokenDto(user, this.jwtService.sign(payload));
  }
}
