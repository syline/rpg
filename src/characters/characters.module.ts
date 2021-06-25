import { Module, Provider } from '@nestjs/common';
import { CharactersService } from './characters.service';
import { CharactersController } from './characters.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Character } from './entities/character.entity';
import { ICHARACTERS_SERVICE } from '../constants/services.constant';

export const CharacterServiceProvider: Provider = {
  provide: ICHARACTERS_SERVICE,
  useClass: CharactersService,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([Character]),
  ],
  controllers: [
    CharactersController,
  ],
  providers: [
    CharacterServiceProvider,
  ],
  exports: [
    CharacterServiceProvider,
  ],
})
export class CharactersModule {}
