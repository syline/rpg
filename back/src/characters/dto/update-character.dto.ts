import { PartialType } from '@nestjs/mapped-types';
import { Character } from '../entities/character.entity';
import { CreateCharacterDto } from './create-character.dto';

export class UpdateCharacterDto extends PartialType(CreateCharacterDto) {
  id: number;
  nextFightTimeMin: Date;

  constructor(character?: Character) {
    super();
    if (character) {
      Object.assign(this, character);
    }
  }
}
