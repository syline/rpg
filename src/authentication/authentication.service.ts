import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SqliteErrorsEnum } from '../enums/sqlite-errors.enum';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AccessTokenDto } from './dto/accessToken.dto';
import { IAuthenticationService } from './interfaces/iauthentication.service';

@Injectable()
export class AuthenticationService implements IAuthenticationService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async register(createUserData: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserData.password, 10);
    try {
      const createdUser = await this.usersService.create({
        ...createUserData,
        password: hashedPassword
      });
      return new User(createdUser);
    } catch (error) {
      if (error?.code === SqliteErrorsEnum.constraint) {
        throw new HttpException('Error : login already exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Error : something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAuthenticatedUser(login: string, plainTextPassword: string): Promise<User> {
    try {
      const user = await this.usersService.getByLogin(login);
      await this.checkPassword(plainTextPassword, user.password);
      return new User(user);
    } catch (error) {
      throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
    }
  }
   
  private async checkPassword(plainTextPassword: string, hashedPassword: string): Promise<void> {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword
    );
    if (!isPasswordMatching) {
      throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
    }
  }

  async login(user: User): Promise<AccessTokenDto> {
    const payload = { username: user.login, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
