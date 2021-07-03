import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IUSERS_SERVICE } from '../constants/services.constant';
import { IUsersService } from '../users/interfaces/iuser.service';
import { SqliteErrorsEnum } from '../enums/sqlite-errors.enum';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { IAuthenticationService } from './interfaces/iauthentication.service';
import { UserDto } from './dto/user.dto';

@Injectable()
export class AuthenticationService implements IAuthenticationService {
  constructor(
    @Inject(IUSERS_SERVICE) private usersService: IUsersService,
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

  async login(user: User): Promise<UserDto> {
    const payload = { username: user.login, sub: user.id };
    return {
      id: user.id,
      login: user.login,
      accessToken: this.jwtService.sign(payload),
    };
  }
}
