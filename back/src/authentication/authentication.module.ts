import { Module, Provider } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET, TOKEN_DURATION } from '../constants/jwt.contant';
import { JwtStrategy } from './strategies/jwt.strategy';
import { IAUTHENTICATION_SERVICE } from '../constants/services.constant';

export const AuthenticationServiceProviders: Provider = { 
  provide: IAUTHENTICATION_SERVICE, 
  useClass: AuthenticationService,
};

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: TOKEN_DURATION },
    }),
  ],
  providers: [
    AuthenticationServiceProviders,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [
    AuthenticationServiceProviders,
  ],
  controllers: [
    AuthenticationController,
  ]
})
export class AuthenticationModule { }
