import { Body, Controller, HttpException, HttpStatus, Inject, Post, UseGuards } from '@nestjs/common';
import { JwtAuthenticationGuard } from '../authentication/guards/jwt-authentication.guard';
import { IFIGHTS_SERVICE } from '../constants/services.constant';
import { NoFightError } from '../errors/no-fight.error';
import { ChallengersDto } from './dto/fight.dto';
import { IFightsService } from './interfaces/ifights.service';
import { FightResults } from './models/fight-result';

@Controller('fights')
@UseGuards(JwtAuthenticationGuard)
export class FightsController {
  constructor(
    @Inject(IFIGHTS_SERVICE) private readonly fightsService: IFightsService,
  ) { }

  @Post()
  async fight(@Body() fight: ChallengersDto): Promise<FightResults> {
    return await this.fightsService.fight(fight.attackerId, fight.defenderId)
    .catch((err) => {
      if (err instanceof NoFightError) {
        throw new HttpException(err.message, HttpStatus.NOT_ACCEPTABLE);
      } else {
        throw new HttpException('Une erreur est survenue', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    })
  }
}
