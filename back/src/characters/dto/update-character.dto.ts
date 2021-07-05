import { IsNotEmpty, IsNumber, Min } from "class-validator";

export class UpdateCharacterDto {
  @IsNumber({
    maxDecimalPlaces: 0
  }, {
    message: 'Le nombre de points de vie doit être un nombre entier'
  })
  @IsNotEmpty({
    message: 'Le nombre de points de vie est obligatoire'
  })
  @Min(0, {
    message: 'Le nombre de points de vie doit être >= 0'
  })
  health: number;

  @IsNumber({
    maxDecimalPlaces: 0
  }, {
    message: 'Le nombre de points de défense doit être un nombre entier'
  })
  @IsNotEmpty({
    message: 'Le nombre de points de défense est obligatoire'
  })
  @Min(0, {
    message: 'Le nombre de points de défense doit être >= 0'
  })
  defense: number;

  @IsNumber({
    maxDecimalPlaces: 0
  }, {
    message: 'Le nombre de points d\'attaque doit être un nombre entier'
  })
  @IsNotEmpty({
    message: 'Le nombre de points d\'attaque est obligatoire'
  })
  @Min(0, {
    message: 'Le nombre de points d\'attaque doit être >= 0'
  })
  attack: number;

  @IsNumber({
    maxDecimalPlaces: 0
  }, {
    message: 'Le nombre de points de magie doit être un nombre entier'
  })
  @IsNotEmpty({
    message: 'Le nombre de points de magie est obligatoire'
  })
  @Min(0, {
    message: 'Le nombre de points de magie doit être >= 0'
  })
  magik: number;
}
