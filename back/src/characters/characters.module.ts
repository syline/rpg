import { forwardRef, Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ICHARACTERS_SERVICE } from '../constants/services.constant';
import { FightsModule } from '../fights/fights.module';
import { CharactersController } from './characters.controller';
import { CharactersRepository } from './characters.repository';
import { CharactersService } from './characters.service';

export const CharacterServiceProvider: Provider = {
  provide: ICHARACTERS_SERVICE,
  useClass: CharactersService,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([CharactersRepository]),
    forwardRef(() => FightsModule),
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
