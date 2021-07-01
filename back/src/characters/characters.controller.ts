import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Fight } from '../fights/entities/fight.entity';
import { IFightsService } from '../fights/interfaces/ifights.service';
import { DeleteResult, UpdateResult } from 'typeorm';
import { JwtAuthenticationGuard } from '../authentication/guards/jwt-authentication.guard';
import { ICHARACTERS_SERVICE, IFIGHTS_SERVICE } from '../constants/services.constant';
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
  ) {}

  @Post()
  create(@Body() createCharacterDto: CreateCharacterDto): Promise<Character> {
    return this.charactersService.create(createCharacterDto);
  }

  @Get(':id/opponent')
  getOpponent(@Param('id') id: string): Promise<Character> {
    return this.charactersService.getOpponent(+id);
  }

  @Get(':id/fights')
  getFights(@Param('id') id: string): Promise<Fight[]> {
    return this.fightsService.findAllByCharacterId(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Character> {
    return this.charactersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCharacterDto: UpdateCharacterDto): Promise<UpdateResult> {
    return this.charactersService.update(+id, updateCharacterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.charactersService.remove(+id);
  }
}
