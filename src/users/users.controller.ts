import { Param, UseGuards } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { JwtAuthenticationGuard } from '../authentication/guards/jwt-authentication.guard';
import { CharactersService } from '../characters/characters.service';

@Controller('users')
@UseGuards(JwtAuthenticationGuard)
export class UsersController {
  constructor(private charactersService: CharactersService) { }

  @Get(':id/characters')
  findAllByUserId(@Param('id') userId: string) {
    return this.charactersService.findAllByUserId(+userId);
  }
}
