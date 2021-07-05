import { Controller, Get, Inject, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ICharactersService } from '../characters/interfaces/icharacters.service';
import { JwtAuthenticationGuard } from '../authentication/guards/jwt-authentication.guard';
import { ICHARACTERS_SERVICE } from '../constants/services.constant';

@Controller('users')
@UseGuards(JwtAuthenticationGuard)
export class UsersController {
  constructor(
    @Inject(ICHARACTERS_SERVICE) private charactersService: ICharactersService,
  ) { }

  @Get(':id/characters')
  findAllByUserId(@Param('id', ParseIntPipe) userId: number) {
    return this.charactersService.findAllByUserId(userId);
  }
}
