import { forwardRef, Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IFIGHTS_SERVICE } from '../constants/services.constant';
import { Fight } from './entities/fight.entity';
import { FightsService } from './fights.service';
import { FightsController } from './fights.controller';
import { CharactersModule } from '../characters/characters.module';

export const FightsServiceProvider: Provider = {
  provide: IFIGHTS_SERVICE,
  useClass: FightsService,
};

@Module({
  imports: [
    TypeOrmModule.forFeature(([Fight])),
    forwardRef(() => CharactersModule),
  ],
  controllers: [FightsController],
  providers: [
    FightsServiceProvider,
  ], 
  exports: [
    FightsServiceProvider,
  ]
})
export class FightsModule {}
