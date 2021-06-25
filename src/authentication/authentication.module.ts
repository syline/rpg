import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from '../constants/jwt.contant';
import { JwtStrategy } from './strategies/jwt.strategy';
import { IAUTHENTICATION_SERVICE } from '../constants/services.constant';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    { 
      provide: IAUTHENTICATION_SERVICE, 
      useClass: AuthenticationService,
    },
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [
    { 
      provide: IAUTHENTICATION_SERVICE, 
      useClass: AuthenticationService,
    },
  ],
  controllers: [
    AuthenticationController,
  ]
})
export class AuthenticationModule { }
