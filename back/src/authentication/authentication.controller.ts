import { Body, ClassSerializerInterceptor, Controller, HttpCode, HttpException, HttpStatus, Inject, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { CredentialsError } from '../errors/credentials.error';
import { LoginAlreadyExistError } from '../errors/login-already-exist.error';
import { IAUTHENTICATION_SERVICE } from '../constants/services.constant';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { LocalAuthenticationGuard } from './guards/local-authentication.guard';
import { IAuthenticationService } from './interfaces/iauthentication.service';
import { RequestWithUser } from './interfaces/request-with-user.interface';
import { UserTokenDto } from './dto/user-token.dto';

@Controller('authentication')
export class AuthenticationController {

  constructor(
    @Inject(IAUTHENTICATION_SERVICE) private authenticationService: IAuthenticationService,
  ) {
  }

  @Post('register')
  @UseInterceptors(ClassSerializerInterceptor)
  async register(@Body() createUserData: CreateUserDto): Promise<User> {
    return this.authenticationService.register(createUserData.login, createUserData.password)
    .catch((err) => {
      if (err instanceof LoginAlreadyExistError) {
        throw new HttpException(err.message, HttpStatus.CONFLICT);
      } else {
        throw new HttpException('Une erreur est survenue', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    })
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('login')
  async login(@Req() request: RequestWithUser): Promise<UserTokenDto> {
    return this.authenticationService.getAccessToken(request.user)
    .catch((err) => {
      if (err instanceof CredentialsError) {
        throw new HttpException(err.message, HttpStatus.FORBIDDEN);
      } else {
        throw new HttpException('Une erreur est survenue', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    })
  }
}
