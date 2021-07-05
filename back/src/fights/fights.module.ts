import { forwardRef, Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharactersModule } from '../characters/characters.module';
import { IFIGHTS_SERVICE } from '../constants/services.constant';
import { FightsController } from './fights.controller';
import { FightsRepository } from './fights.repository';
import { FightsService } from './fights.service';

export const FightsServiceProvider: Provider = {
  provide: IFIGHTS_SERVICE,
  useClass: FightsService,
};

@Module({
  imports: [
    TypeOrmModule.forFeature(([FightsRepository])),
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
