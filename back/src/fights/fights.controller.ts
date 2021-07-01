import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { JwtAuthenticationGuard } from '../authentication/guards/jwt-authentication.guard';
import { IFIGHTS_SERVICE } from '../constants/services.constant';
import { ChallengersDto } from './dto/fight.dto';
import { IFightsService } from './interfaces/ifights.service';
import { IRound } from './interfaces/iround';

@Controller('fights')
@UseGuards(JwtAuthenticationGuard)
export class FightsController {
  constructor(
    @Inject(IFIGHTS_SERVICE) private readonly fightsService: IFightsService,
  ) { }

  @Post()
  async fight(@Body() fight: ChallengersDto): Promise<IRound[]> {
    return await this.fightsService.fights(fight);
  }
}
