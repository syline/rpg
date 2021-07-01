import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
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
    return this.authenticationService.getAuthenticatedUser(login, password);
  }
}