import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { CredentialsError } from '../../shared/errors/credentials.error';
import { IAUTHENTICATION_SERVICE } from '../../constants/services.constant';
import { User } from '../../users/entities/user.entity';
import { IAuthenticationService } from '../interfaces/iauthentication.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(IAUTHENTICATION_SERVICE) private authenticationService: IAuthenticationService,
  ) {
    super({
      usernameField: 'login'
    });
  }

  async validate(login: string, password: string): Promise<User> {
    return this.authenticationService.checkLoginPassword(login, password)
      .catch((err) => {
        if (err instanceof CredentialsError) {
          throw new HttpException(err.message, HttpStatus.UNAUTHORIZED);
        } else {
          throw new HttpException('Une erreur est survenue', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      })
  }
}