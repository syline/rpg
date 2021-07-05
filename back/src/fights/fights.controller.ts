import { HttpStatus } from '@nestjs/common';
import { Body, Controller, HttpException, Inject, Post, UseGuards } from '@nestjs/common';
import { NoFightError } from '../errors/no-fight.error';
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
