import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CharactersModule } from '../characters/characters.module';
import { IUSERS_SERVICE } from '../constants/services.constant';

export const UsersServiceProvider: Provider = {
  provide: IUSERS_SERVICE,
  useClass: UsersService,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CharactersModule,
  ],
  controllers: [
    UsersController,
  ],
  providers: [
    UsersServiceProvider,
  ],
  exports: [
    UsersServiceProvider,
  ],
})
export class UsersModule { }
