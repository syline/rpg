import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IFIGHTS_SERVICE } from '../constants/services.constant';
import { Fight } from './entities/fight.entity';
import { FightsService } from './fights.service';

export const FightsServiceProvider: Provider = {
  provide: IFIGHTS_SERVICE,
  useClass: FightsService,
};

@Module({
  imports: [
    TypeOrmModule.forFeature(([Fight])),
  ],
  controllers: [],
  providers: [
    FightsServiceProvider,
  ], 
  exports: [
    FightsServiceProvider,
  ]
})
export class FightsModule {}
