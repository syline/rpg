import { Body, Controller, Delete, Get, HttpException, HttpStatus, Inject, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { NoOpponentError } from '../shared/errors/no-opponent.error';
import { DeleteResult, UpdateResult } from 'typeorm';
import { JwtAuthenticationGuard } from '../authentication/guards/jwt-authentication.guard';
import { RequestWithUser } from '../authentication/interfaces/request-with-user.interface';
import { ICHARACTERS_SERVICE, IFIGHTS_SERVICE } from '../constants/services.constant';
import { Fight } from '../fights/entities/fight.entity';
import { IFightsService } from '../fights/interfaces/ifights.service';
import { LevelUpError } from '../shared/errors/level-up.error';
import { MaxNbCharacterError } from '../shared/errors/max-nb-character.error';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { Character } from './entities/character.entity';
import { ICharactersService } from './interfaces/icharacters.service';

@Controller('characters')
@UseGuards(JwtAuthenticationGuard)
export class CharactersController {
  constructor(
    @Inject(ICHARACTERS_SERVICE) private readonly charactersService: ICharactersService,
    @Inject(IFIGHTS_SERVICE) private readonly fightsService: IFightsService,
  ) { }

  @Post()
  create(@Req() request: RequestWithUser, @Body() createCharacterDto: CreateCharacterDto): Promise<Character | void> {
    return this.charactersService.create(createCharacterDto.name, request.user.id)
      .catch((err) => {
        if (err instanceof MaxNbCharacterError) {
          throw new HttpException(err.message, HttpStatus.NOT_ACCEPTABLE);
        } else {
          throw new HttpException('Une erreur est survenue', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      });
  }

  @Get(':id/opponent')
  getOpponent(@Param('id', ParseIntPipe) id: number): Promise<Character> {
    return this.charactersService.getOpponent(id)
      .catch((err) => {
        if (err instanceof NoOpponentError) {
          throw new HttpException(err.message, HttpStatus.NOT_FOUND);
        } else {
          throw new HttpException('Une erreur est survenue', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      })
  }

  @Get(':id/fights')
  getFights(@Param('id', ParseIntPipe) id: number): Promise<Fight[]> {
    return this.fightsService.findAllByCharacterId(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Character> {
    return this.charactersService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateCharacterDto: UpdateCharacterDto): Promise<UpdateResult> {
    return this.charactersService.forwardSkillsToCharacter(
      +id,
      updateCharacterDto.health,
      updateCharacterDto.defense,
      updateCharacterDto.attack,
      updateCharacterDto.magik,
    )
      .then((characterToUpdate: Character) => {
        return this.charactersService.update(id, characterToUpdate);
      })
      .catch((err) => {
        if (err instanceof LevelUpError) {
          throw new HttpException(err.message, HttpStatus.NOT_ACCEPTABLE);
        } else {
          throw new HttpException('Une erreur est survenue', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      });
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.charactersService.remove(id);
  }
}
