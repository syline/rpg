import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharactersModule } from '../characters/characters.module';
import { IUSERS_SERVICE } from '../constants/services.constant';
import { UsersController } from './users.controller';
import { UserRepository } from './users.repository';
import { UsersService } from './users.service';

export const UsersServiceProvider: Provider = {
  provide: IUSERS_SERVICE,
  useClass: UsersService,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
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
