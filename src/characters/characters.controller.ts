import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { JwtAuthenticationGuard } from '../authentication/guards/jwt-authentication.guard';
import { ICHARACTERS_SERVICE } from '../constants/services.constant';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { Character } from './entities/character.entity';
import { ICharactersService } from './interfaces/icharacters.service';

@Controller('characters')
@UseGuards(JwtAuthenticationGuard)
export class CharactersController {
  constructor(
    @Inject(ICHARACTERS_SERVICE) private readonly charactersService: ICharactersService,
  ) {}

  @Post()
  create(@Body() createCharacterDto: CreateCharacterDto): Promise<Character> {
    return this.charactersService.create(createCharacterDto);
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
