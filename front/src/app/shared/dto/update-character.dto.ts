import { Character } from '../models/character';

export class UpdateCharacterDto {
  health: number;
  defense: number;
  attack: number;
  magik: number;

  constructor(oldCharacter: Character, newCharacter: Character) {
    this.health = newCharacter.health - oldCharacter.health;
    this.defense = newCharacter.defense - oldCharacter.defense;
    this.attack = newCharacter.attack - oldCharacter.attack;
    this.magik = newCharacter.magik - oldCharacter.magik;
  }
}
