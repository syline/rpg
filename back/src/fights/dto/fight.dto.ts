import { IsNotEmpty, IsNumber } from "class-validator";

export class ChallengersDto {
  @IsNotEmpty({
    message: 'L\'attaquant est obligatoire'
  })
  @IsNumber({
    maxDecimalPlaces: 0,
  }, {
    message: 'L\'id de l\'attaquant doit être un nombre entier'
  })
  attackerId: number;

  @IsNotEmpty({
    message: 'Le défenseur est obligatoire'
  })
  @IsNumber({
    maxDecimalPlaces: 0,
  }, {
    message: 'L\'id du défenseur doit être un nombre entier'
  })
  defenderId: number;
}